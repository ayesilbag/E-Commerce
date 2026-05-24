using System.Collections.Concurrent;
using Microsoft.Extensions.Options;
using ECommerce.Application.Common.Configuration;
using ECommerce.Application.Common.Interfaces;

namespace ECommerce.Infrastructure.Services;

public class RateLimitService : IRateLimitService
{
    private readonly ConcurrentDictionary<string, Queue<DateTime>> _userRequests = new();
    private readonly Queue<DateTime> _globalHourlyRequests = new();
    private readonly Queue<DateTime> _globalDailyRequests = new();
    private readonly object _globalLock = new();
    private readonly IOptionsMonitor<RateLimitSettings> _rateLimitOptions;
    
    public RateLimitService(IOptionsMonitor<RateLimitSettings> rateLimitOptions)
    {
        _rateLimitOptions = rateLimitOptions;
    }
    
    private static readonly TimeSpan UserTimeWindow = TimeSpan.FromMinutes(1);
    private static readonly TimeSpan HourlyTimeWindow = TimeSpan.FromHours(1);
    private static readonly TimeSpan DailyTimeWindow = TimeSpan.FromDays(1);

    public Task<bool> IsAllowedAsync(string key, CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        var options = _rateLimitOptions.CurrentValue;
        
        // Check global limits first
        lock (_globalLock)
        {
            // Clean up old hourly requests
            while (_globalHourlyRequests.Count > 0 && now - _globalHourlyRequests.Peek() > HourlyTimeWindow)
            {
                _globalHourlyRequests.Dequeue();
            }
            
            // Clean up old daily requests
            while (_globalDailyRequests.Count > 0 && now - _globalDailyRequests.Peek() > DailyTimeWindow)
            {
                _globalDailyRequests.Dequeue();
            }
            
            // Check global hourly limit
            if (_globalHourlyRequests.Count >= options.MaxGlobalRequestsPerHour)
            {
                return Task.FromResult(false);
            }
            
            // Check global daily limit
            if (_globalDailyRequests.Count >= options.MaxGlobalRequestsPerDay)
            {
                return Task.FromResult(false);
            }
        }
        
        // Check per-user limit
        var userRequests = _userRequests.GetOrAdd(key, _ => new Queue<DateTime>());
        
        lock (userRequests)
        {
            // Remove old user requests outside the time window
            while (userRequests.Count > 0 && now - userRequests.Peek() > UserTimeWindow)
            {
                userRequests.Dequeue();
            }

            // Check if user is within the rate limit
            if (userRequests.Count >= options.MaxUserRequestsPerMinute)
            {
                return Task.FromResult(false);
            }
            
            // All checks passed, record the request
            userRequests.Enqueue(now);
            
            lock (_globalLock)
            {
                _globalHourlyRequests.Enqueue(now);
                _globalDailyRequests.Enqueue(now);
            }
            
            return Task.FromResult(true);
        }
    }
}

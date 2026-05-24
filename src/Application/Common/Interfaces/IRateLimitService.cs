namespace ECommerce.Application.Common.Interfaces;

public interface IRateLimitService
{
    Task<bool> IsAllowedAsync(string key, CancellationToken cancellationToken = default);
}
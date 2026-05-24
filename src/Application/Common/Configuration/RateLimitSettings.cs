namespace ECommerce.Application.Common.Configuration;

public class RateLimitSettings
{
    public int MaxUserRequestsPerMinute { get; set; } = 10;
    public int MaxGlobalRequestsPerHour { get; set; } = 100;
    public int MaxGlobalRequestsPerDay { get; set; } = 1000;
} 
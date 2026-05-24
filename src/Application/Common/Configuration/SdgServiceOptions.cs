namespace ECommerce.Application.Common.Configuration;

public class SdgServiceOptions
{
    public string BaseUrl { get; set; } = string.Empty;
    public string LlmBaseUrl { get; set; } = string.Empty;
    public string HfBaseUrl { get; set; } = string.Empty;
    public string EndpointPath { get; set; } = string.Empty;
    public string ApiKey { get; set; } = string.Empty;
    public bool IsLlmInFirstPlan { get; set; } = false;
} 
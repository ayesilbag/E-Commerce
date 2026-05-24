using System.Text.Json.Serialization;

namespace ECommerce.Application.Common.Models.SDG;

public class ProcessPromptResponse
{
    [JsonPropertyName("message")]
    public string Message { get; set; } = string.Empty;

    [JsonPropertyName("responseContent")]
    public ResponseContent ResponseContent { get; set; } = new();
}

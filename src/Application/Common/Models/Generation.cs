using System.Text.Json.Serialization;

namespace ECommerce.Application.Common.Models;
public class Generation
{
    [JsonPropertyName("text")]
    public string? Text { get; set; }
}

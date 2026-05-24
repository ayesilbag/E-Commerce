using System.Text.Json.Serialization;

namespace ECommerce.Application.Common.Models.SDG;
public class RelevantIndicator
{
    [JsonPropertyName("indicator_number")]
    public string IndicatorNumber { get; set; } = string.Empty;

    [JsonPropertyName("indicator_text")]
    public string IndicatorText { get; set; } = string.Empty;

    [JsonPropertyName("is_selected")]
    public bool IsSelected { get; set; }
}

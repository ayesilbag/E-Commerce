using System.Text.Json.Serialization;

namespace ECommerce.Application.Common.Models.SDG;
public class Sdg
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("sdg_number")]
    public string SdgNumber { get; set; } = string.Empty;

    [JsonPropertyName("sdg_name")]
    public string SdgName { get; set; } = string.Empty;

    [JsonPropertyName("sdg_explanation")]
    public string SdgExplanation { get; set; } = string.Empty;

    [JsonPropertyName("sdg_is_answered")]
    public bool SdgIsAnswered { get; set; }

    [JsonPropertyName("sdg_is_selected")]
    public bool SdgIsSelected { get; set; }

    [JsonPropertyName("relevant_indicators")]
    public List<RelevantIndicator> RelevantIndicators { get; set; } = [];

    [JsonPropertyName("selected_faculty")]
    public object? SelectedFaculty { get; set; }

    [JsonPropertyName("selected_center")]
    public object? SelectedCenter { get; set; }

    [JsonPropertyName("selected_admin")]
    public object? SelectedAdmin { get; set; }

    [JsonPropertyName("unit_type")]
    public object? UnitType { get; set; }
}

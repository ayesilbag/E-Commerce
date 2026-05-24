using System.Text.Json.Serialization;

namespace ECommerce.Application.Common.Models.SDG;
public class ResponseContent
{
    [JsonPropertyName("sdgs")]
    public List<Sdg> Sdgs { get; set; } = new();
}

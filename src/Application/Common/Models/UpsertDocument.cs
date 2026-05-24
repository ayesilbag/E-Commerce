using Microsoft.AspNetCore.Http;

namespace ECommerce.Application.Common.Models;
public class UpsertDocument
{
    public IFormFile? Files { get; set; }
    public string? DocId { get; set; }
    public string? Splitter { get; set; }
    public string? Metadata { get; set; }
    public bool ReplaceExisting { get; set; }
}

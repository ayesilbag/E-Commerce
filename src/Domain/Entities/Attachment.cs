namespace ECommerce.Domain.Entities;

public class Attachment : BaseAuditableEntity
{
    public required string UserId { get; set; }
    public required string DialogId { get; set; }
    public required string FileName { get; set; }
    public required string Extension { get; set; }
    public required string ContentType { get; set; }
    public required string FileKey { get; set; }
    public required string FileUrl { get; set; }
    public long FileSize { get; set; }
}

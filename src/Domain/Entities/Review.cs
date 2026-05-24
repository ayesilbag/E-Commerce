namespace ECommerce.Domain.Entities;

public class Review : BaseAuditableEntity
{
    public required string ProductId { get; set; }
    public required string UserId { get; set; }
    public required string UserName { get; set; }
    public int Rating { get; set; }
    public required string Title { get; set; }
    public required string Comment { get; set; }
    public string[]? Images { get; set; }
    public int Helpful { get; set; }

    public Product Product { get; set; } = null!;
}

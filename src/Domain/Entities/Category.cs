namespace ECommerce.Domain.Entities;

public class Category : BaseEntity
{
    public required string Name { get; set; }
    public required string Slug { get; set; }
    public string? Description { get; set; }
    public string? Image { get; set; }
    public string? Icon { get; set; }
    public string? ParentCategoryId { get; set; }
    public int ProductCount { get; set; }
    public bool IsActive { get; set; } = true;
    public int DisplayOrder { get; set; }

    public Category? ParentCategory { get; set; }
    public ICollection<Category> Subcategories { get; set; } = new List<Category>();
}

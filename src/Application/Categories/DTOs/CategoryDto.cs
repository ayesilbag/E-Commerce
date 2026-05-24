using ECommerce.Application.Products.DTOs;

namespace ECommerce.Application.Categories.DTOs;

public class CategoryDto
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public required string Slug { get; set; }
    public string? Description { get; set; }
    public string? Image { get; set; }
    public string? Icon { get; set; }
    public string? ParentCategoryId { get; set; }
    public int ProductCount { get; set; }
    public bool IsActive { get; set; }
    public int DisplayOrder { get; set; }
    public CategoryDto[] Subcategories { get; set; } = Array.Empty<CategoryDto>();
}

public class CategoryDetailDto
{
    public required CategoryDto Category { get; set; }
    public required ProductDto[] Products { get; set; }
    public required PaginationDto Pagination { get; set; }
}

using ECommerce.Application.Categories.DTOs;
using ECommerce.Infrastructure.Data;
using ECommerce.WebServer.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.WebServer.Endpoints;

public class Categories : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        var group = app.MapGroup("/api/categories")
            .WithTags("Categories")
            .WithOpenApi();

        group.MapGet("/", GetCategoriesAsync);
        group.MapGet("/{categoryId}", GetCategoryDetailAsync);
    }

    private async Task<IResult> GetCategoriesAsync(
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        var categories = await context.Categories
            .Where(x => x.IsActive && x.ParentCategoryId == null)
            .OrderBy(x => x.DisplayOrder)
            .Select(x => new CategoryDto
            {
                Id = x.Id,
                Name = x.Name,
                Slug = x.Slug,
                Description = x.Description,
                Image = x.Image,
                Icon = x.Icon,
                ParentCategoryId = x.ParentCategoryId,
                ProductCount = x.ProductCount,
                IsActive = x.IsActive,
                DisplayOrder = x.DisplayOrder,
                Subcategories = Array.Empty<CategoryDto>()
            })
            .ToListAsync(cancellationToken);

        // Load subcategories for each category
        var categoryIds = categories.Select(c => c.Id).ToList();
        var subcategories = await context.Categories
            .Where(x => x.IsActive && categoryIds.Contains(x.ParentCategoryId!))
            .OrderBy(x => x.DisplayOrder)
            .ToListAsync(cancellationToken);

        foreach (var category in categories)
        {
            var subs = subcategories
                .Where(s => s.ParentCategoryId == category.Id)
                .Select(s => new CategoryDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Slug = s.Slug,
                    Description = s.Description,
                    Image = s.Image,
                    Icon = s.Icon,
                    ParentCategoryId = s.ParentCategoryId,
                    ProductCount = s.ProductCount,
                    IsActive = s.IsActive,
                    DisplayOrder = s.DisplayOrder,
                    Subcategories = Array.Empty<CategoryDto>()
                })
                .ToArray();
            category.Subcategories = subs;
        }

        return Results.Ok(new { success = true, data = categories });
    }

    private async Task<IResult> GetCategoryDetailAsync(
        string categoryId,
        ApplicationDbContext context,
        CancellationToken cancellationToken,
        [FromQuery] int page = 1,
        [FromQuery] int limit = 20)
    {
        var category = await context.Categories
            .FirstOrDefaultAsync(x => x.Id == categoryId, cancellationToken);

        if (category is null)
            return Results.NotFound(new { success = false, error = new { code = "CATEGORY_NOT_FOUND", message = "Kategori bulunamadı" } });

        var productEntities = await context.Products
            .Where(x => x.Category == category.Name && x.IsActive && !x.IsDeleted)
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToListAsync(cancellationToken);

        var products = productEntities.Select(ProductMapper.ToDto).ToList();

        var totalCount = await context.Products
            .CountAsync(x => x.Category == category.Name && x.IsActive, cancellationToken);

        var categoryDto = new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Slug = category.Slug,
            Description = category.Description,
            Image = category.Image,
            Icon = category.Icon,
            ParentCategoryId = category.ParentCategoryId,
            ProductCount = category.ProductCount,
            IsActive = category.IsActive,
            DisplayOrder = category.DisplayOrder,
            Subcategories = Array.Empty<CategoryDto>()
        };

        var response = new
        {
            category = categoryDto,
            products = products.ToArray(),
            pagination = new
            {
                page,
                limit,
                total = totalCount,
                pages = (int)Math.Ceiling((double)totalCount / limit)
            }
        };

        return Results.Ok(new { success = true, data = response });
    }
}

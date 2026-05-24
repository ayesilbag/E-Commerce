using ECommerce.Application.Categories.DTOs;
using ECommerce.Domain.Constants;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.WebServer.Endpoints;

public class AdminCategories : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        var group = app.MapGroup("/api/admin/categories")
            .WithTags("Admin")
            .WithOpenApi()
            .RequireAuthorization(Policies.Admin);

        group.MapGet("/", ListAsync);
        group.MapPost("/", CreateAsync);
        group.MapPut("/{categoryId}", UpdateAsync);
        group.MapDelete("/{categoryId}", DeleteAsync);
    }

    private static async Task<IResult> ListAsync(
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        var categories = await context.Categories
            .OrderBy(c => c.DisplayOrder)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                Description = c.Description,
                Image = c.Image,
                Icon = c.Icon,
                ParentCategoryId = c.ParentCategoryId,
                ProductCount = c.ProductCount,
                IsActive = c.IsActive,
                DisplayOrder = c.DisplayOrder,
                Subcategories = Array.Empty<CategoryDto>()
            })
            .ToListAsync(cancellationToken);

        return Results.Ok(new { success = true, data = categories });
    }

    private static async Task<IResult> CreateAsync(
        AdminCategoryRequest request,
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return Results.BadRequest(new { success = false, message = "Kategori adı zorunludur" });
        }

        var slug = string.IsNullOrWhiteSpace(request.Slug)
            ? Slugify(request.Name)
            : Slugify(request.Slug);

        if (await context.Categories.AnyAsync(c => c.Slug == slug, cancellationToken))
        {
            return Results.Conflict(new { success = false, message = "Bu slug zaten kullanılıyor" });
        }

        var category = new Category
        {
            Id = Guid.NewGuid().ToString(),
            Name = request.Name.Trim(),
            Slug = slug,
            Description = request.Description,
            Image = request.Image,
            Icon = request.Icon,
            ParentCategoryId = request.ParentCategoryId,
            DisplayOrder = request.DisplayOrder,
            IsActive = request.IsActive,
            ProductCount = 0
        };

        context.Categories.Add(category);
        await context.SaveChangesAsync(cancellationToken);

        return Results.Created($"/api/admin/categories/{category.Id}", new { success = true, data = category });
    }

    private static async Task<IResult> UpdateAsync(
        string categoryId,
        AdminCategoryRequest request,
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        var category = await context.Categories.FirstOrDefaultAsync(c => c.Id == categoryId, cancellationToken);
        if (category is null)
        {
            return Results.NotFound(new { success = false, message = "Kategori bulunamadı" });
        }

        if (!string.IsNullOrWhiteSpace(request.Name))
        {
            category.Name = request.Name.Trim();
        }

        if (!string.IsNullOrWhiteSpace(request.Slug))
        {
            category.Slug = Slugify(request.Slug);
        }

        category.Description = request.Description ?? category.Description;
        category.Image = request.Image ?? category.Image;
        category.Icon = request.Icon ?? category.Icon;
        category.ParentCategoryId = request.ParentCategoryId ?? category.ParentCategoryId;
        category.DisplayOrder = request.DisplayOrder;
        category.IsActive = request.IsActive;

        await context.SaveChangesAsync(cancellationToken);
        return Results.Ok(new { success = true, data = category });
    }

    private static async Task<IResult> DeleteAsync(
        string categoryId,
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        var category = await context.Categories.FirstOrDefaultAsync(c => c.Id == categoryId, cancellationToken);
        if (category is null)
        {
            return Results.NotFound(new { success = false, message = "Kategori bulunamadı" });
        }

        context.Categories.Remove(category);
        await context.SaveChangesAsync(cancellationToken);
        return Results.Ok(new { success = true, message = "Kategori silindi" });
    }

    private static string Slugify(string value) =>
        value.Trim().ToLowerInvariant()
            .Replace(' ', '-')
            .Replace("ı", "i")
            .Replace("ğ", "g")
            .Replace("ü", "u")
            .Replace("ş", "s")
            .Replace("ö", "o")
            .Replace("ç", "c");
}

public class AdminCategoryRequest
{
    public string? Name { get; set; }
    public string? Slug { get; set; }
    public string? Description { get; set; }
    public string? Image { get; set; }
    public string? Icon { get; set; }
    public string? ParentCategoryId { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

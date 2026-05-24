using ECommerce.Application.Products.DTOs;
using ECommerce.Domain.Constants;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure.Data;
using ECommerce.WebServer.Infrastructure;
using ECommerce.WebServer.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.WebServer.Endpoints;

public class AdminProducts : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        var group = app.MapGroup("/api/admin/products")
            .WithTags("Admin")
            .WithOpenApi()
            .RequireAuthorization(Policies.Admin);

        group.MapGet("/", ListAsync);
        group.MapGet("/import/template", DownloadTemplateAsync);
        group.MapPost("/import", ImportExcelAsync).DisableAntiforgery();
        group.MapGet("/{productId}", GetAsync);
        group.MapPost("/", CreateAsync);
        group.MapPut("/{productId}", UpdateAsync);
        group.MapDelete("/{productId}", DeleteAsync);
    }

    private static IResult DownloadTemplateAsync(ProductExcelService excelService) =>
        Results.File(
            excelService.CreateTemplate(),
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "urun-import-sablonu.xlsx");

    private static async Task<IResult> ImportExcelAsync(
        IFormFile file,
        ProductExcelService excelService,
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        if (file is null || file.Length == 0)
        {
            return Results.BadRequest(new { success = false, message = "Excel dosyası gerekli" });
        }

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (ext is not ".xlsx" and not ".xls")
        {
            return Results.BadRequest(new { success = false, message = "Sadece .xlsx veya .xls dosyaları desteklenir" });
        }

        await using var stream = file.OpenReadStream();
        var result = await excelService.ImportAsync(stream, context, cancellationToken);

        return Results.Ok(new
        {
            success = true,
            message = $"{result.Imported} ürün içe aktarıldı, {result.Failed} hata",
            data = result
        });
    }

    private static async Task<IResult> ListAsync(
        ApplicationDbContext context,
        CancellationToken cancellationToken,
        [FromQuery] int page = 1,
        [FromQuery] int limit = 20,
        [FromQuery] string? search = null,
        [FromQuery] bool? isActive = null)
    {
        var query = context.Products.Where(p => !p.IsDeleted);

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(p => p.Name.Contains(search) || p.Sku.Contains(search));
        }

        if (isActive.HasValue)
        {
            query = query.Where(p => p.IsActive == isActive.Value);
        }

        var total = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderByDescending(p => p.Created)
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToListAsync(cancellationToken);

        return Results.Ok(new
        {
            success = true,
            data = new
            {
                products = items.Select(ProductMapper.ToDto),
                pagination = new { page, limit, total, pages = (int)Math.Ceiling(total / (double)limit) }
            }
        });
    }

    private static async Task<IResult> GetAsync(
        string productId,
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        var product = await context.Products
            .FirstOrDefaultAsync(p => p.Id == productId && !p.IsDeleted, cancellationToken);

        if (product is null)
        {
            return Results.NotFound(new { success = false, error = new { code = "NOT_FOUND", message = "Ürün bulunamadı" } });
        }

        return Results.Ok(new { success = true, data = ProductMapper.ToDto(product) });
    }

    private static async Task<IResult> CreateAsync(
        AdminProductRequest request,
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Sku) || string.IsNullOrWhiteSpace(request.Category))
        {
            return Results.BadRequest(new { success = false, message = "Ad, SKU ve kategori zorunludur" });
        }

        var product = new Product
        {
            Id = Guid.NewGuid().ToString(),
            Name = request.Name.Trim(),
            Description = request.Description,
            LongDescription = request.LongDescription,
            Price = request.Price,
            OriginalPrice = request.OriginalPrice,
            Category = request.Category.Trim(),
            Subcategory = request.Subcategory,
            Image = request.Image ?? string.Empty,
            Images = request.Images ?? Array.Empty<string>(),
            Stock = request.Stock,
            Sku = request.Sku.Trim(),
            Barcode = request.Barcode,
            Badge = request.Badge,
            IsActive = request.IsActive,
            IsFeatured = request.IsFeatured,
            Tags = request.Tags ?? Array.Empty<string>(),
            Created = DateTimeOffset.UtcNow
        };

        context.Products.Add(product);
        await context.SaveChangesAsync(cancellationToken);

        return Results.Created($"/api/admin/products/{product.Id}", new { success = true, data = ProductMapper.ToDto(product) });
    }

    private static async Task<IResult> UpdateAsync(
        string productId,
        AdminProductRequest request,
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        var product = await context.Products
            .FirstOrDefaultAsync(p => p.Id == productId && !p.IsDeleted, cancellationToken);

        if (product is null)
        {
            return Results.NotFound(new { success = false, error = new { code = "NOT_FOUND", message = "Ürün bulunamadı" } });
        }

        if (!string.IsNullOrWhiteSpace(request.Name))
        {
            product.Name = request.Name.Trim();
        }

        product.Description = request.Description ?? product.Description;
        product.LongDescription = request.LongDescription ?? product.LongDescription;
        product.Price = request.Price;
        product.OriginalPrice = request.OriginalPrice;
        if (!string.IsNullOrWhiteSpace(request.Category))
        {
            product.Category = request.Category.Trim();
        }

        product.Subcategory = request.Subcategory ?? product.Subcategory;
        if (request.Image is not null)
        {
            product.Image = request.Image;
        }

        if (request.Images is not null)
        {
            product.Images = request.Images;
        }

        product.Stock = request.Stock;
        if (!string.IsNullOrWhiteSpace(request.Sku))
        {
            product.Sku = request.Sku.Trim();
        }

        product.Barcode = request.Barcode ?? product.Barcode;
        product.Badge = request.Badge ?? product.Badge;
        product.IsActive = request.IsActive;
        product.IsFeatured = request.IsFeatured;
        if (request.Tags is not null)
        {
            product.Tags = request.Tags;
        }

        product.LastModified = DateTimeOffset.UtcNow;
        await context.SaveChangesAsync(cancellationToken);

        return Results.Ok(new { success = true, data = ProductMapper.ToDto(product) });
    }

    private static async Task<IResult> DeleteAsync(
        string productId,
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        var product = await context.Products
            .FirstOrDefaultAsync(p => p.Id == productId && !p.IsDeleted, cancellationToken);

        if (product is null)
        {
            return Results.NotFound(new { success = false, error = new { code = "NOT_FOUND", message = "Ürün bulunamadı" } });
        }

        product.IsDeleted = true;
        product.IsActive = false;
        product.LastModified = DateTimeOffset.UtcNow;
        await context.SaveChangesAsync(cancellationToken);

        return Results.Ok(new { success = true, message = "Ürün silindi" });
    }
}

public class AdminProductRequest
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? LongDescription { get; set; }
    public decimal Price { get; set; }
    public decimal? OriginalPrice { get; set; }
    public string? Category { get; set; }
    public string? Subcategory { get; set; }
    public string? Image { get; set; }
    public string[]? Images { get; set; }
    public int Stock { get; set; }
    public string? Sku { get; set; }
    public string? Barcode { get; set; }
    public string? Badge { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsFeatured { get; set; }
    public string[]? Tags { get; set; }
}

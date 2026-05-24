using ShippingMethodDto = ECommerce.Application.Shipping.DTOs.ShippingMethodDto;
using ECommerce.Domain.Constants;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.WebServer.Endpoints;

public class AdminShipping : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        var group = app.MapGroup("/api/admin/shipping-methods")
            .WithTags("Admin")
            .WithOpenApi()
            .RequireAuthorization(Policies.Admin);

        group.MapGet("/", ListAsync);
        group.MapPost("/", CreateAsync);
        group.MapPut("/{id}", UpdateAsync);
        group.MapDelete("/{id}", DeleteAsync);
    }

    private static async Task<IResult> ListAsync(
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        var methods = await context.ShippingOptions
            .OrderBy(m => m.Name)
            .Select(m => ToDto(m))
            .ToListAsync(cancellationToken);

        return Results.Ok(new { success = true, data = methods });
    }

    private static async Task<IResult> CreateAsync(
        AdminShippingMethodRequest request,
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return Results.BadRequest(new { success = false, message = "Ad zorunludur" });
        }

        var method = new ShippingOption
        {
            Id = Guid.NewGuid().ToString(),
            Name = request.Name.Trim(),
            Description = request.Description,
            Cost = request.Cost,
            EstimatedDays = request.EstimatedDays,
            Provider = request.Provider,
            IsActive = request.IsActive
        };

        context.ShippingOptions.Add(method);
        await context.SaveChangesAsync(cancellationToken);

        return Results.Created($"/api/admin/shipping-methods/{method.Id}", new { success = true, data = ToDto(method) });
    }

    private static async Task<IResult> UpdateAsync(
        string id,
        AdminShippingMethodRequest request,
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        var method = await context.ShippingOptions.FirstOrDefaultAsync(m => m.Id == id, cancellationToken);
        if (method is null)
        {
            return Results.NotFound(new { success = false, message = "Kargo yöntemi bulunamadı" });
        }

        if (!string.IsNullOrWhiteSpace(request.Name))
        {
            method.Name = request.Name.Trim();
        }

        method.Description = request.Description ?? method.Description;
        method.Cost = request.Cost;
        method.EstimatedDays = request.EstimatedDays;
        method.Provider = request.Provider ?? method.Provider;
        method.IsActive = request.IsActive;

        await context.SaveChangesAsync(cancellationToken);
        return Results.Ok(new { success = true, data = ToDto(method) });
    }

    private static async Task<IResult> DeleteAsync(
        string id,
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        var method = await context.ShippingOptions.FirstOrDefaultAsync(m => m.Id == id, cancellationToken);
        if (method is null)
        {
            return Results.NotFound(new { success = false, message = "Kargo yöntemi bulunamadı" });
        }

        context.ShippingOptions.Remove(method);
        await context.SaveChangesAsync(cancellationToken);
        return Results.Ok(new { success = true, message = "Silindi" });
    }

    private static ShippingMethodDto ToDto(ShippingOption m) => new()
    {
        Id = m.Id,
        Name = m.Name,
        Description = m.Description,
        Cost = m.Cost,
        EstimatedDays = m.EstimatedDays,
        Provider = m.Provider
    };
}

public class AdminShippingMethodRequest
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public decimal Cost { get; set; }
    public int EstimatedDays { get; set; } = 3;
    public string? Provider { get; set; }
    public bool IsActive { get; set; } = true;
}

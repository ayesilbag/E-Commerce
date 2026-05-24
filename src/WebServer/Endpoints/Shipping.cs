using ECommerce.Application.Shipping.DTOs;
using ShippingMethodDto = ECommerce.Application.Shipping.DTOs.ShippingMethodDto;
using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.WebServer.Endpoints;

public class Shipping : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        var group = app.MapGroup("/api/shipping")
            .WithTags("Shipping")
            .WithOpenApi();

        group.MapGet("/methods", GetShippingMethodsAsync);
        group.MapPost("/calculate-cost", CalculateShippingCostAsync);
    }

    private static async Task<IResult> GetShippingMethodsAsync(
        ApplicationDbContext context,
        CancellationToken cancellationToken,
        [FromQuery] string? postalCode = null,
        [FromQuery] int? weight = null)
    {
        var shippingMethods = await context.ShippingOptions
            .Where(m => m.IsActive)
            .OrderBy(m => m.Cost)
            .Select(m => new ShippingMethodDto
            {
                Id = m.Id,
                Name = m.Name,
                Description = m.Description,
                Cost = m.Cost,
                EstimatedDays = m.EstimatedDays,
                Provider = m.Provider
            })
            .ToListAsync(cancellationToken);

        if (shippingMethods.Count == 0)
        {
            shippingMethods =
            [
                new ShippingMethodDto
                {
                    Id = "ship_standard",
                    Name = "Standart Kargo",
                    Description = "3-5 iş günü içerisinde teslim",
                    Cost = 0,
                    EstimatedDays = 4,
                    Provider = "Aras Kargo"
                }
            ];
        }

        if (weight.HasValue && weight.Value > 5000)
        {
            foreach (var method in shippingMethods)
            {
                method.Cost += 15;
            }
        }

        return Results.Ok(new { success = true, data = shippingMethods });
    }

    private static async Task<IResult> CalculateShippingCostAsync(
        CalculateShippingCostRequest request,
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        var method = await context.ShippingOptions
            .FirstOrDefaultAsync(m => m.Id == request.ShippingMethodId && m.IsActive, cancellationToken);

        decimal shippingCost = method?.Cost ?? 0;
        var estimatedDelivery = DateTime.UtcNow.AddDays(method?.EstimatedDays ?? 3);

        var totalWeight = request.Items.Sum(i => i.Weight * i.Quantity);
        if (totalWeight > 5000)
        {
            shippingCost += 20;
        }

        var response = new ShippingCostResponse
        {
            ShippingCost = shippingCost,
            EstimatedDelivery = estimatedDelivery
        };

        return Results.Ok(new { success = true, data = response });
    }
}

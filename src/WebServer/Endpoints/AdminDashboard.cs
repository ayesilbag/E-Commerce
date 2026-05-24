using ECommerce.Domain.Constants;
using ECommerce.Domain.Enums;
using ECommerce.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.WebServer.Endpoints;

public class AdminDashboard : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        var group = app.MapGroup("/api/admin/dashboard")
            .WithTags("Admin")
            .WithOpenApi()
            .RequireAuthorization(Policies.Admin);

        group.MapGet("/", GetStatsAsync);
    }

    private static async Task<IResult> GetStatsAsync(ApplicationDbContext context, CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        var monthStart = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);

        var totalProducts = await context.Products.CountAsync(p => !p.IsDeleted, cancellationToken);
        var activeProducts = await context.Products.CountAsync(p => !p.IsDeleted && p.IsActive, cancellationToken);
        var totalOrders = await context.Orders.CountAsync(cancellationToken);
        var pendingOrders = await context.Orders.CountAsync(o => o.Status == OrderStatus.Pending, cancellationToken);
        var revenueThisMonth = await context.Orders
            .Where(o => o.Created >= monthStart && o.Status != OrderStatus.Cancelled)
            .SumAsync(o => o.Total, cancellationToken);
        var revenueTotal = await context.Orders
            .Where(o => o.Status != OrderStatus.Cancelled)
            .SumAsync(o => o.Total, cancellationToken);
        var lowStock = await context.Products
            .CountAsync(p => !p.IsDeleted && p.IsActive && p.Stock <= 5, cancellationToken);

        var recentOrders = await context.Orders
            .OrderByDescending(o => o.Created)
            .Take(5)
            .Select(o => new
            {
                o.Id,
                o.OrderNumber,
                status = o.Status.ToString(),
                o.Total,
                created = o.Created
            })
            .ToListAsync(cancellationToken);

        return Results.Ok(new
        {
            success = true,
            data = new
            {
                stats = new
                {
                    totalProducts,
                    activeProducts,
                    totalOrders,
                    pendingOrders,
                    revenueThisMonth,
                    revenueTotal,
                    lowStock
                },
                recentOrders
            }
        });
    }
}

using ECommerce.Domain.Constants;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.WebServer.Endpoints;

public class AdminCoupons : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        var group = app.MapGroup("/api/admin/coupons")
            .WithTags("Admin")
            .WithOpenApi()
            .RequireAuthorization(Policies.Admin);

        group.MapGet("/", ListAsync);
        group.MapPost("/", CreateAsync);
        group.MapPut("/{id}", UpdateAsync);
        group.MapDelete("/{id}", DeleteAsync);
    }

    private static async Task<IResult> ListAsync(ApplicationDbContext context, CancellationToken cancellationToken)
    {
        var coupons = await context.Coupons
            .OrderByDescending(c => c.Created)
            .Select(c => new
            {
                c.Id,
                c.Code,
                c.Description,
                c.DiscountAmount,
                c.DiscountPercent,
                c.MinimumOrderAmount,
                c.MaxUses,
                c.UsedCount,
                c.ValidFrom,
                c.ValidUntil,
                c.IsActive
            })
            .ToListAsync(cancellationToken);

        return Results.Ok(new { success = true, data = coupons });
    }

    private static async Task<IResult> CreateAsync(AdminCouponRequest request, ApplicationDbContext context, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Code))
        {
            return Results.BadRequest(new { success = false, message = "Kupon kodu zorunludur" });
        }

        var code = request.Code.Trim().ToUpperInvariant();
        if (await context.Coupons.AnyAsync(c => c.Code == code, cancellationToken))
        {
            return Results.Conflict(new { success = false, message = "Bu kod zaten var" });
        }

        if (request.DiscountAmount is null && request.DiscountPercent is null)
        {
            return Results.BadRequest(new { success = false, message = "İndirim tutarı veya yüzdesi gerekli" });
        }

        var coupon = new Coupon
        {
            Id = Guid.NewGuid().ToString(),
            Code = code,
            Description = request.Description,
            DiscountAmount = request.DiscountAmount,
            DiscountPercent = request.DiscountPercent,
            MinimumOrderAmount = request.MinimumOrderAmount,
            MaxUses = request.MaxUses,
            ValidFrom = request.ValidFrom,
            ValidUntil = request.ValidUntil,
            IsActive = request.IsActive
        };

        context.Coupons.Add(coupon);
        await context.SaveChangesAsync(cancellationToken);
        return Results.Created($"/api/admin/coupons/{coupon.Id}", new { success = true, data = coupon });
    }

    private static async Task<IResult> UpdateAsync(string id, AdminCouponRequest request, ApplicationDbContext context, CancellationToken cancellationToken)
    {
        var coupon = await context.Coupons.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
        if (coupon is null)
        {
            return Results.NotFound(new { success = false, message = "Kupon bulunamadı" });
        }

        if (!string.IsNullOrWhiteSpace(request.Code))
        {
            coupon.Code = request.Code.Trim().ToUpperInvariant();
        }

        coupon.Description = request.Description ?? coupon.Description;
        coupon.DiscountAmount = request.DiscountAmount ?? coupon.DiscountAmount;
        coupon.DiscountPercent = request.DiscountPercent ?? coupon.DiscountPercent;
        coupon.MinimumOrderAmount = request.MinimumOrderAmount ?? coupon.MinimumOrderAmount;
        coupon.MaxUses = request.MaxUses ?? coupon.MaxUses;
        coupon.ValidFrom = request.ValidFrom ?? coupon.ValidFrom;
        coupon.ValidUntil = request.ValidUntil ?? coupon.ValidUntil;
        coupon.IsActive = request.IsActive;

        await context.SaveChangesAsync(cancellationToken);
        return Results.Ok(new { success = true, data = coupon });
    }

    private static async Task<IResult> DeleteAsync(string id, ApplicationDbContext context, CancellationToken cancellationToken)
    {
        var coupon = await context.Coupons.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
        if (coupon is null)
        {
            return Results.NotFound(new { success = false, message = "Kupon bulunamadı" });
        }

        context.Coupons.Remove(coupon);
        await context.SaveChangesAsync(cancellationToken);
        return Results.Ok(new { success = true, message = "Silindi" });
    }
}

public class AdminCouponRequest
{
    public string? Code { get; set; }
    public string? Description { get; set; }
    public decimal? DiscountAmount { get; set; }
    public decimal? DiscountPercent { get; set; }
    public decimal? MinimumOrderAmount { get; set; }
    public int? MaxUses { get; set; }
    public DateTime? ValidFrom { get; set; }
    public DateTime? ValidUntil { get; set; }
    public bool IsActive { get; set; } = true;
}

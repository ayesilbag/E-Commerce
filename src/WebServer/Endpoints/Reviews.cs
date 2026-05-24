using ECommerce.Application.Products.DTOs;
using ECommerce.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ECommerce.Infrastructure.Identity;

namespace ECommerce.WebServer.Endpoints;

public class Reviews : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        var group = app.MapGroup("/api/products/{productId}/reviews")
            .WithTags("Reviews")
            .WithOpenApi();

        group.MapPost("/", CreateReviewAsync).RequireAuthorization();
        group.MapPost("/{reviewId}/helpful", MarkAsHelpfulAsync);
    }

    private async Task<IResult> CreateReviewAsync(
        string productId,
        CreateReviewRequest request,
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        var user = await userManager.FindByIdAsync(userId);
        if (user is null)
            return Results.Unauthorized();

        // Check if user already reviewed this product
        var existingReview = await context.Reviews
            .AnyAsync(r => r.ProductId == productId && r.UserId == userId, cancellationToken);
        if (existingReview)
            return Results.BadRequest(new { success = false, message = "Bu ürün için zaten yorum yapmışsınız" });

        var review = new Domain.Entities.Review
        {
            Id = Guid.NewGuid().ToString(),
            ProductId = productId,
            UserId = userId,
            UserName = user.FullName,
            Rating = request.Rating,
            Title = request.Title,
            Comment = request.Comment,
            Images = request.Images?.ToArray() ?? Array.Empty<string>(),
            Helpful = 0,
            Created = DateTimeOffset.UtcNow
        };

        context.Reviews.Add(review);

        // Update product rating
        var productReviews = await context.Reviews
            .Where(r => r.ProductId == productId)
            .ToListAsync(cancellationToken);
        var avgRating = productReviews.Count > 0 ? productReviews.Average(r => (decimal)r.Rating) : 0;
        var product = await context.Products
            .FirstOrDefaultAsync(p => p.Id == productId, cancellationToken);
        if (product != null)
        {
            product.Rating = avgRating;
            product.ReviewCount = productReviews.Count;
        }

        await context.SaveChangesAsync(cancellationToken);

        var reviewDto = new ReviewDto
        {
            Id = review.Id,
            ProductId = review.ProductId,
            UserId = review.UserId,
            UserName = review.UserName,
            Rating = review.Rating,
            Title = review.Title,
            Comment = review.Comment,
            Images = review.Images?.ToArray() ?? Array.Empty<string>(),
            Helpful = review.Helpful,
            CreatedAt = review.Created.DateTime
        };

        return Results.Created($"/api/products/{productId}/reviews/{review.Id}", new { success = true, message = "Yorum başarıyla eklendi", data = new { review = reviewDto } });
    }

    private async Task<IResult> MarkAsHelpfulAsync(
        string productId,
        string reviewId,
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        var review = await context.Reviews
            .FirstOrDefaultAsync(r => r.Id == reviewId && r.ProductId == productId, cancellationToken);
        if (review is null)
            return Results.NotFound(new { success = false, message = "Yorum bulunamadı" });

        review.Helpful += 1;
        await context.SaveChangesAsync(cancellationToken);

        return Results.Ok(new { success = true, message = "Yorum işaretlendi", data = new { helpful = review.Helpful } });
    }
}

public record CreateReviewRequest(
    int Rating,
    string Title,
    string Comment,
    string[]? Images
);

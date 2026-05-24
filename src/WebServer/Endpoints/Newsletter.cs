using ECommerce.Application.Newsletter.DTOs;
using ECommerce.Domain.Enums;
using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.WebServer.Endpoints;

public class Newsletter : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        var group = app.MapGroup("/api/newsletter")
            .WithTags("Newsletter")
            .WithOpenApi();

        group.MapPost("/subscribe", SubscribeAsync);
        group.MapPost("/unsubscribe", UnsubscribeAsync);
    }

    private async Task<IResult> SubscribeAsync(
        SubscribeRequest request,
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        // Check if already subscribed
        var existing = await context.NewsletterSubscriptions
            .FirstOrDefaultAsync(n => n.Email == request.Email, cancellationToken);
        if (existing != null)
        {
            if (existing.Status == NewsletterSubscriptionStatus.Subscribed)
                return Results.BadRequest(new { success = false, message = "Bu email zaten abone" });

            // Reactivate
            existing.Status = NewsletterSubscriptionStatus.Subscribed;
            existing.UnsubscribedAt = null;
        }
        else
        {
            var subscription = new Domain.Entities.NewsletterSubscription
            {
                Id = Guid.NewGuid().ToString(),
                Email = request.Email,
                Name = request.Name,
                Status = NewsletterSubscriptionStatus.Subscribed,
                SubscribedAt = DateTime.UtcNow,
                IsVerified = false,
                VerificationToken = Guid.NewGuid().ToString()
            };

            context.NewsletterSubscriptions.Add(subscription);
        }

        await context.SaveChangesAsync(cancellationToken);

        return Results.Created("/api/newsletter/subscribe", new { success = true, message = "Aboneliğiniz başarıyla kaydedildi. Lütfen email adresinizi doğrulayın." });
    }

    private async Task<IResult> UnsubscribeAsync(
        UnsubscribeRequest request,
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        var subscription = await context.NewsletterSubscriptions
            .FirstOrDefaultAsync(n => n.Email == request.Email, cancellationToken);
        if (subscription is null)
            return Results.NotFound(new { success = false, message = "Abonelik bulunamadı" });

        subscription.Status = NewsletterSubscriptionStatus.Unsubscribed;
        subscription.UnsubscribedAt = DateTime.UtcNow;

        await context.SaveChangesAsync(cancellationToken);

        return Results.Ok(new { success = true, message = "Aboneliğiniz kaldırıldı" });
    }
}

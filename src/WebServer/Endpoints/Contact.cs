using ECommerce.Application.Contact.DTOs;
using ECommerce.Domain.Enums;
using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.WebServer.Endpoints;

public class Contact : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        var group = app.MapGroup("/api")
            .WithTags("Contact")
            .WithOpenApi();

        group.MapPost("/contact", SubmitContactFormAsync);
    }

    private async Task<IResult> SubmitContactFormAsync(
        ContactMessageRequest request,
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        var message = new Domain.Entities.ContactMessage
        {
            Name = request.Name,
            Email = request.Email,
            Phone = request.Phone,
            Subject = request.Subject,
            Message = request.Message,
            Status = ContactMessageStatus.New,
            Created = DateTimeOffset.UtcNow
        };

        context.ContactMessages.Add(message);
        await context.SaveChangesAsync(cancellationToken);

        var ticketId = $"TKT-{DateTime.UtcNow:yyyyMMdd}-{new Random().Next(1000, 9999)}";

        return Results.Created($"/api/contact/{ticketId}", new { success = true, message = "Mesajınız başarıyla alındı. En kısa sürede size dönüş yapacağız.", data = new { ticketId } });
    }
}

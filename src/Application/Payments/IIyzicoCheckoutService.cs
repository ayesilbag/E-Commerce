using ECommerce.Application.Payments.DTOs;
using ECommerce.Domain.Entities;

namespace ECommerce.Application.Payments;

public interface IIyzicoCheckoutService
{
    Task<IyzicoInitializeResponse> InitializeAsync(
        Order order,
        PaymentClient client,
        ApplicationUserInfo buyer,
        string callbackUrl,
        CancellationToken cancellationToken);

    Task<IyzicoCallbackResult> CompleteCallbackAsync(
        PaymentClient client,
        string token,
        CancellationToken cancellationToken);
}

public record ApplicationUserInfo(
    string Id,
    string Email,
    string FullName,
    string? Phone,
    string Ip);

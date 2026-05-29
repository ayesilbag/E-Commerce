using ECommerce.Domain.Entities;

namespace ECommerce.Application.Payments;

public interface IPaymentClientResolver
{
    Task<PaymentClient?> ResolveAsync(string? paymentClientCode, string? tenantCode, CancellationToken cancellationToken);
}

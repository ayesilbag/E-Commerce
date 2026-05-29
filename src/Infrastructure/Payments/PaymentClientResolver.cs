using ECommerce.Application.Payments;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Infrastructure.Payments;

public class PaymentClientResolver(ApplicationDbContext context) : IPaymentClientResolver
{
    public async Task<PaymentClient?> ResolveAsync(
        string? paymentClientCode,
        string? tenantCode,
        CancellationToken cancellationToken)
    {
        if (!string.IsNullOrWhiteSpace(paymentClientCode))
        {
            return await context.PaymentClients
                .FirstOrDefaultAsync(c => c.Code == paymentClientCode && c.IsActive, cancellationToken);
        }

        if (!string.IsNullOrWhiteSpace(tenantCode))
        {
            var byTenant = await context.PaymentClients
                .Where(c => c.IsActive && c.TenantCode == tenantCode)
                .OrderByDescending(c => c.IsDefault)
                .FirstOrDefaultAsync(cancellationToken);

            if (byTenant is not null)
                return byTenant;
        }

        var defaultClient = await context.PaymentClients
            .Where(c => c.IsActive && c.IsDefault)
            .FirstOrDefaultAsync(cancellationToken);

        if (defaultClient is not null)
            return defaultClient;

        return await context.PaymentClients
            .Where(c => c.IsActive)
            .OrderBy(c => c.Name)
            .FirstOrDefaultAsync(cancellationToken);
    }
}

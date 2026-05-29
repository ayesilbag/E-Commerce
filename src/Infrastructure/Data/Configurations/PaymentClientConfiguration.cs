using ECommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ECommerce.Infrastructure.Data.Configurations;

public class PaymentClientConfiguration : IEntityTypeConfiguration<PaymentClient>
{
    public void Configure(EntityTypeBuilder<PaymentClient> builder)
    {
        builder.Property(x => x.Code).IsRequired().HasMaxLength(50);
        builder.Property(x => x.Name).IsRequired().HasMaxLength(200);
        builder.Property(x => x.TenantCode).HasMaxLength(100);
        builder.Property(x => x.ApiKey).IsRequired().HasMaxLength(200);
        builder.Property(x => x.SecretKey).IsRequired().HasMaxLength(200);
        builder.Property(x => x.Locale).IsRequired().HasMaxLength(5);
        builder.Property(x => x.Currency).IsRequired().HasMaxLength(3);
        builder.Property(x => x.CallbackBaseUrl).HasMaxLength(500);
        builder.Property(x => x.EnabledInstallments).HasMaxLength(50);
        builder.Property(x => x.SuccessRedirectUrl).HasMaxLength(500);
        builder.Property(x => x.FailureRedirectUrl).HasMaxLength(500);

        builder.HasIndex(x => x.Code).IsUnique();
        builder.HasIndex(x => new { x.IsActive, x.TenantCode });
    }
}

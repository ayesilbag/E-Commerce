using ECommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ECommerce.Infrastructure.Data.Configurations;

public class PaymentSettingsConfiguration : IEntityTypeConfiguration<PaymentSettings>
{
    public void Configure(EntityTypeBuilder<PaymentSettings> builder)
    {
        builder.Property(x => x.CallbackBaseUrl).HasMaxLength(500);
        builder.Property(x => x.DefaultCurrency).IsRequired().HasMaxLength(3);
    }
}

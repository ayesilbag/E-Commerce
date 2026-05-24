using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ECommerce.Domain.Entities;

namespace ECommerce.Infrastructure.Data.Configurations;

public class ShippingOptionConfiguration : IEntityTypeConfiguration<ShippingOption>
{
    public void Configure(EntityTypeBuilder<ShippingOption> builder)
    {
        builder.ToTable("ShippingOptions");
        builder.Property(x => x.Name).IsRequired().HasMaxLength(200);
        builder.Property(x => x.Description).HasMaxLength(1000);
        builder.Property(x => x.Provider).HasMaxLength(200);
        builder.Property(x => x.Cost).HasColumnType("decimal(10,2)");
        builder.Property(x => x.IsActive).HasDefaultValue(true);
    }
}

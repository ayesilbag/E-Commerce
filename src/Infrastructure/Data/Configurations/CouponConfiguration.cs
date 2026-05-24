using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ECommerce.Domain.Entities;

namespace ECommerce.Infrastructure.Data.Configurations;

public class CouponConfiguration : IEntityTypeConfiguration<Coupon>
{
    public void Configure(EntityTypeBuilder<Coupon> builder)
    {
        builder.Property(x => x.Code).IsRequired().HasMaxLength(50);
        builder.HasIndex(x => x.Code).IsUnique();
        builder.Property(x => x.Description).HasMaxLength(500);
        builder.Property(x => x.DiscountAmount).HasColumnType("decimal(10,2)");
        builder.Property(x => x.DiscountPercent).HasColumnType("decimal(5,2)");
        builder.Property(x => x.MinimumOrderAmount).HasColumnType("decimal(10,2)");
    }
}

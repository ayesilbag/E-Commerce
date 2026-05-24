using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ECommerce.Domain.Entities;

namespace ECommerce.Infrastructure.Data.Configurations;

public class CartConfiguration : IEntityTypeConfiguration<Cart>
{
    public void Configure(EntityTypeBuilder<Cart> builder)
    {
        builder.Property(x => x.Subtotal).HasColumnType("decimal(10,2)");
        builder.Property(x => x.Tax).HasColumnType("decimal(10,2)");
        builder.Property(x => x.ShippingCost).HasColumnType("decimal(10,2)");
        builder.Property(x => x.DiscountAmount).HasColumnType("decimal(10,2)");
        builder.Property(x => x.Total).HasColumnType("decimal(10,2)");
        builder.Property(x => x.DiscountCode).HasMaxLength(50);
        builder.Property(x => x.CartToken).HasMaxLength(500);

        builder.HasIndex(x => x.UserId);
        builder.HasIndex(x => x.CartToken);
    }
}

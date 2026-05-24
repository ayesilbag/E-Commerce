using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ECommerce.Domain.Entities;

namespace ECommerce.Infrastructure.Data.Configurations;

public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
{
    public void Configure(EntityTypeBuilder<OrderItem> builder)
    {
        builder.Property(x => x.ProductName).IsRequired().HasMaxLength(500);
        builder.Property(x => x.ProductImage).IsRequired().HasMaxLength(500);
        builder.Property(x => x.Price).HasColumnType("decimal(10,2)");
        builder.Property(x => x.Subtotal).HasColumnType("decimal(10,2)");
        builder.Property(x => x.VariantColor).HasMaxLength(50);
        builder.Property(x => x.VariantSize).HasMaxLength(20);
        builder.Property(x => x.VariantFit).HasMaxLength(50);
    }
}

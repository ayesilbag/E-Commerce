using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ECommerce.Domain.Entities;

namespace ECommerce.Infrastructure.Data.Configurations;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.Property(x => x.OrderNumber).IsRequired().HasMaxLength(50);
        builder.HasIndex(x => x.OrderNumber).IsUnique();

        builder.Property(x => x.Subtotal).HasColumnType("decimal(10,2)");
        builder.Property(x => x.DiscountAmount).HasColumnType("decimal(10,2)");
        builder.Property(x => x.ShippingCost).HasColumnType("decimal(10,2)");
        builder.Property(x => x.Tax).HasColumnType("decimal(10,2)");
        builder.Property(x => x.Total).HasColumnType("decimal(10,2)");

        builder.HasMany(x => x.Items).WithOne(x => x.Order).OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.ShippingAddress).WithMany().OnDelete(DeleteBehavior.Restrict);

        builder.OwnsOne(x => x.ShippingMethod, b =>
        {
            b.Property(x => x.Name).IsRequired().HasMaxLength(255);
            b.Property(x => x.Description).HasMaxLength(500);
            b.Property(x => x.Cost).HasColumnType("decimal(10,2)");
            b.Property(x => x.Provider).HasMaxLength(100);
        });

        builder.OwnsOne(x => x.PaymentMethod, b =>
        {
            b.Property(x => x.Type).IsRequired().HasMaxLength(50);
            b.Property(x => x.CardName).HasMaxLength(255);
            b.Property(x => x.CardLast4).HasMaxLength(4);
            b.Property(x => x.CardBrand).HasMaxLength(50);
        });

        builder.Property(x => x.Notes).HasMaxLength(1000);
        builder.Property(x => x.CancellationReason).HasMaxLength(500);

        builder.HasIndex(x => x.UserId);
        builder.HasIndex(x => x.Status);
        builder.HasIndex(x => x.Created);
    }
}

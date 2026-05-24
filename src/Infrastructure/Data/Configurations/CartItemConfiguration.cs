using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ECommerce.Domain.Entities;

namespace ECommerce.Infrastructure.Data.Configurations;

public class CartItemConfiguration : IEntityTypeConfiguration<CartItem>
{
    public void Configure(EntityTypeBuilder<CartItem> builder)
    {
        builder.HasOne(x => x.Cart).WithMany(x => x.Items).HasForeignKey(x => x.CartId).OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(x => x.Product).WithMany().HasForeignKey(x => x.ProductId).OnDelete(DeleteBehavior.Restrict);

        builder.Property(x => x.VariantColor).HasMaxLength(50);
        builder.Property(x => x.VariantSize).HasMaxLength(20);
        builder.Property(x => x.VariantFit).HasMaxLength(50);
        builder.Property(x => x.VariantSleeveType).HasMaxLength(50);
        builder.Property(x => x.VariantNeckType).HasMaxLength(50);
        builder.Property(x => x.VariantMaterial).HasMaxLength(100);
        builder.Property(x => x.VariantSeason).HasMaxLength(50);
    }
}

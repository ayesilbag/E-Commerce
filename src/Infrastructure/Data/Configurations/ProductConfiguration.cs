using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ECommerce.Domain.Entities;

namespace ECommerce.Infrastructure.Data.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.Property(x => x.Name).IsRequired().HasMaxLength(500);
        builder.Property(x => x.Price).HasColumnType("decimal(10,2)");
        builder.Property(x => x.OriginalPrice).HasColumnType("decimal(10,2)");
        builder.Property(x => x.Sku).IsRequired().HasMaxLength(100);
        builder.Property(x => x.Rating).HasColumnType("decimal(3,2)");

        builder.OwnsMany(x => x.Specifications, b =>
        {
            b.WithOwner();
            b.Property(x => x.Name).IsRequired().HasMaxLength(200);
            b.Property(x => x.Value).IsRequired().HasMaxLength(500);
        });

        builder.OwnsMany(x => x.Variants, b =>
        {
            b.WithOwner();
            b.Property(x => x.Price).HasColumnType("decimal(10,2)");
            b.Property(x => x.Color).HasMaxLength(50);
            b.Property(x => x.Size).HasMaxLength(20);
            b.Property(x => x.Fit).HasMaxLength(50);
            b.Property(x => x.SleeveType).HasMaxLength(50);
            b.Property(x => x.NeckType).HasMaxLength(50);
            b.Property(x => x.Material).HasMaxLength(100);
            b.Property(x => x.Season).HasMaxLength(50);
            b.Property(x => x.Sku).HasMaxLength(100);
        });

        builder.Property(x => x.Image).HasMaxLength(500);
        builder.PrimitiveCollection(x => x.Images);
        builder.PrimitiveCollection(x => x.Tags);

        builder.HasIndex(x => x.Category);
        builder.HasIndex(x => x.Price);
        builder.HasIndex(x => x.Rating);
    }
}

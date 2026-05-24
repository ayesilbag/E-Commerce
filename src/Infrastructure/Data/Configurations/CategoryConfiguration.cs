using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ECommerce.Domain.Entities;

namespace ECommerce.Infrastructure.Data.Configurations;

public class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.Property(x => x.Name).IsRequired().HasMaxLength(255);
        builder.Property(x => x.Slug).IsRequired().HasMaxLength(255);
        builder.Property(x => x.Description).HasMaxLength(1000);
        builder.Property(x => x.Image).HasMaxLength(500);
        builder.Property(x => x.Icon).HasMaxLength(100);

        builder.HasIndex(x => x.Slug).IsUnique();

        builder.HasOne(x => x.ParentCategory).WithMany(x => x.Subcategories).HasForeignKey(x => x.ParentCategoryId).OnDelete(DeleteBehavior.Restrict);
    }
}

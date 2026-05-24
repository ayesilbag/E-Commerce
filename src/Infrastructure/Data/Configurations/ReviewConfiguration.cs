using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ECommerce.Domain.Entities;

namespace ECommerce.Infrastructure.Data.Configurations;

public class ReviewConfiguration : IEntityTypeConfiguration<Review>
{
    public void Configure(EntityTypeBuilder<Review> builder)
    {
        builder.Property(x => x.Title).IsRequired().HasMaxLength(255);
        builder.Property(x => x.Comment).IsRequired().HasMaxLength(2000);
        builder.Property(x => x.UserName).IsRequired().HasMaxLength(255);

        builder.HasOne(x => x.Product).WithMany(x => x.Reviews).HasForeignKey(x => x.ProductId).OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => x.ProductId);
        builder.HasIndex(x => x.UserId);
        builder.HasIndex(x => x.Rating);
    }
}

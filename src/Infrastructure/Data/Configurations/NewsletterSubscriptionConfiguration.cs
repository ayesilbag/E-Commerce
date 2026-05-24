using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ECommerce.Domain.Entities;

namespace ECommerce.Infrastructure.Data.Configurations;

public class NewsletterSubscriptionConfiguration : IEntityTypeConfiguration<NewsletterSubscription>
{
    public void Configure(EntityTypeBuilder<NewsletterSubscription> builder)
    {
        builder.Property(x => x.Email).IsRequired().HasMaxLength(255);
        builder.Property(x => x.Name).HasMaxLength(255);
        builder.Property(x => x.VerificationToken).HasMaxLength(500);

        builder.HasIndex(x => x.Email).IsUnique();
    }
}

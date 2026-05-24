using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ECommerce.Domain.Entities;

namespace ECommerce.Infrastructure.Data.Configurations;

public class AddressConfiguration : IEntityTypeConfiguration<Address>
{
    public void Configure(EntityTypeBuilder<Address> builder)
    {
        builder.Property(x => x.FullName).IsRequired().HasMaxLength(255);
        builder.Property(x => x.Phone).IsRequired().HasMaxLength(20);
        builder.Property(x => x.AddressLine).IsRequired().HasMaxLength(500);
        builder.Property(x => x.City).IsRequired().HasMaxLength(100);
        builder.Property(x => x.District).IsRequired().HasMaxLength(100);
        builder.Property(x => x.PostalCode).IsRequired().HasMaxLength(20);
        builder.Property(x => x.Country).IsRequired().HasMaxLength(100);

        builder.HasIndex(x => x.UserId);

        builder.HasIndex(x => x.UserId)
            .IsUnique()
            .HasFilter("[IsDefault] = 1")
            .HasDatabaseName("IX_Addresses_UserId_Default");
    }
}

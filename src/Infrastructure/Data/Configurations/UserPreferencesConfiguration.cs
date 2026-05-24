using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ECommerce.Domain.Entities;

namespace ECommerce.Infrastructure.Data.Configurations;

public class UserPreferencesConfiguration : IEntityTypeConfiguration<UserPreferences>
{
    public void Configure(EntityTypeBuilder<UserPreferences> builder)
    {
        builder.Property(x => x.Language).HasMaxLength(5).HasDefaultValue("tr");
        builder.Property(x => x.Currency).HasMaxLength(3).HasDefaultValue("TRY");

        builder.HasIndex(x => x.UserId).IsUnique();
    }
}

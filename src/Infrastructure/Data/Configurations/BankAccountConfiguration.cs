using ECommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ECommerce.Infrastructure.Data.Configurations;

public class BankAccountConfiguration : IEntityTypeConfiguration<BankAccount>
{
    public void Configure(EntityTypeBuilder<BankAccount> builder)
    {
        builder.Property(x => x.BankName).IsRequired().HasMaxLength(100);
        builder.Property(x => x.AccountHolder).IsRequired().HasMaxLength(255);
        builder.Property(x => x.Iban).IsRequired().HasMaxLength(34);
        builder.Property(x => x.BranchName).HasMaxLength(100);
        builder.Property(x => x.Currency).IsRequired().HasMaxLength(3);
        builder.Property(x => x.Instructions).HasMaxLength(500);

        builder.HasIndex(x => new { x.IsActive, x.SortOrder });
    }
}

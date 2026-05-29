using ECommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ECommerce.Infrastructure.Data.Configurations;

public class PaymentSessionConfiguration : IEntityTypeConfiguration<PaymentSession>
{
    public void Configure(EntityTypeBuilder<PaymentSession> builder)
    {
        builder.Property(x => x.ConversationId).IsRequired().HasMaxLength(100);
        builder.Property(x => x.Token).IsRequired().HasMaxLength(100);
        builder.Property(x => x.IyzicoPaymentId).HasMaxLength(50);
        builder.Property(x => x.IyzicoPaymentStatus).HasMaxLength(50);
        builder.Property(x => x.ErrorMessage).HasMaxLength(500);
        builder.Property(x => x.Currency).IsRequired().HasMaxLength(3);

        builder.HasIndex(x => x.Token).IsUnique();
        builder.HasIndex(x => x.OrderId);

        builder.HasOne(x => x.Order)
            .WithMany()
            .HasForeignKey(x => x.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.PaymentClient)
            .WithMany()
            .HasForeignKey(x => x.PaymentClientId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

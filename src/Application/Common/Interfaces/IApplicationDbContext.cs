using DomainCart = ECommerce.Domain.Entities.Cart;
using ECommerce.Domain.Entities;

namespace ECommerce.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    // Auth related
    DbSet<Address> Addresses { get; }
    DbSet<UserPreferences> UserPreferences { get; }

    // Products
    DbSet<Product> Products { get; }
    DbSet<Category> Categories { get; }
    DbSet<Review> Reviews { get; }
    DbSet<ShippingOption> ShippingOptions { get; }
    DbSet<Coupon> Coupons { get; }
    DbSet<BankAccount> BankAccounts { get; }

    // Orders
    DbSet<Order> Orders { get; }
    DbSet<OrderItem> OrderItems { get; }

    // Cart
    DbSet<DomainCart> Carts { get; }
    DbSet<CartItem> CartItems { get; }

    // Wishlist
    DbSet<WishlistItem> WishlistItems { get; }

    // Contact & Newsletter
    DbSet<ContactMessage> ContactMessages { get; }
    DbSet<NewsletterSubscription> NewsletterSubscriptions { get; }

    // Legacy
    DbSet<Attachment> Attachments { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}

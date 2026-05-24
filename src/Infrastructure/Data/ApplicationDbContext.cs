using System.Reflection;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure.Identity;

namespace ECommerce.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    // Auth related
    public DbSet<Address> Addresses => Set<Address>();
    public DbSet<UserPreferences> UserPreferences => Set<UserPreferences>();

    // Products
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<ShippingOption> ShippingOptions => Set<ShippingOption>();
    public DbSet<Coupon> Coupons => Set<Coupon>();
    public DbSet<BankAccount> BankAccounts => Set<BankAccount>();

    // Orders
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

    // Cart
    public DbSet<Cart> Carts => Set<Cart>();
    public DbSet<CartItem> CartItems => Set<CartItem>();

    // Wishlist
    public DbSet<WishlistItem> WishlistItems => Set<WishlistItem>();

    // Contact & Newsletter
    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();
    public DbSet<NewsletterSubscription> NewsletterSubscriptions => Set<NewsletterSubscription>();

    // Legacy
    public DbSet<Attachment> Attachments => Set<Attachment>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Configure SQL Server specific options
        builder.Model.SetMaxIdentifierLength(128);

        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        // Configure Identity tables to use our schema
        builder.Entity<ApplicationUser>(entity =>
        {
            entity.ToTable(name: "Users");
            entity.Property(e => e.FullName).HasMaxLength(256);
            entity.Property(e => e.Phone).HasMaxLength(20);
            entity.Property(e => e.Avatar).HasMaxLength(500);
        });

        builder.Entity<IdentityRole>(entity =>
        {
            entity.ToTable(name: "Roles");
        });

        builder.Entity<IdentityUserRole<string>>(entity =>
        {
            entity.ToTable("UserRoles");
        });

        builder.Entity<IdentityUserClaim<string>>(entity =>
        {
            entity.ToTable("UserClaims");
        });

        builder.Entity<IdentityUserLogin<string>>(entity =>
        {
            entity.ToTable("UserLogins");
        });

        builder.Entity<IdentityRoleClaim<string>>(entity =>
        {
            entity.ToTable("RoleClaims");
        });

        builder.Entity<IdentityUserToken<string>>(entity =>
        {
            entity.ToTable("UserTokens");
        });
    }
}

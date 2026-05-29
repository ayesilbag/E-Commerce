using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using ECommerce.Domain.Constants;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Enums;
using ECommerce.Infrastructure.Identity;

namespace ECommerce.Infrastructure.Data;

public static class InitialiserExtensions
{
    public static async Task InitialiseDatabaseAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();

        var initialiser = scope.ServiceProvider.GetRequiredService<ApplicationDbContextInitialiser>();

        await initialiser.InitialiseAsync();

        await initialiser.SeedAsync();
    }
}

public class ApplicationDbContextInitialiser
{
    private readonly ILogger<ApplicationDbContextInitialiser> _logger;
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;

    public ApplicationDbContextInitialiser(ILogger<ApplicationDbContextInitialiser> logger, ApplicationDbContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
    {
        _logger = logger;
        _context = context;
        _userManager = userManager;
        _roleManager = roleManager;
    }

    public async Task InitialiseAsync()
    {
        try
        {
            await _context.Database.MigrateAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while initialising the database.");
            throw;
        }
    }

    public async Task SeedAsync()
    {
        try
        {
            await TrySeedAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while seeding the database.");
            throw;
        }
    }

    public async Task TrySeedAsync()
    {
        // Default roles
        var administratorRole = new IdentityRole(Roles.Administrator);

        if (_roleManager.Roles.All(r => r.Name != administratorRole.Name))
        {
            await _roleManager.CreateAsync(administratorRole);
        }

        // Default users
        var administrator = new ApplicationUser
        {
            UserName = "administrator@localhost",
            Email = "administrator@localhost",
            FullName = "Administrator",
            EmailConfirmed = true
        };

        if (_userManager.Users.All(u => u.UserName != administrator.UserName))
        {
            await _userManager.CreateAsync(administrator, "Administrator1!");
            if (!string.IsNullOrWhiteSpace(administratorRole.Name))
            {
                await _userManager.AddToRolesAsync(administrator, [administratorRole.Name]);
            }
        }
        else if (await _userManager.FindByNameAsync(administrator.UserName!) is { EmailConfirmed: false } existingAdmin)
        {
            existingAdmin.EmailConfirmed = true;
            await _userManager.UpdateAsync(existingAdmin);
        }

        if (!_context.PaymentSettings.Any(s => s.Id == PaymentSettings.GlobalId))
        {
            _context.PaymentSettings.Add(new PaymentSettings
            {
                Id = PaymentSettings.GlobalId,
                DefaultCurrency = "TRY"
            });
            await _context.SaveChangesAsync();
        }

        if (!_context.ShippingOptions.Any())
        {
            _context.ShippingOptions.AddRange(
                new ShippingOption
                {
                    Id = "ship_standard",
                    Name = "Standart Kargo",
                    Description = "3-5 iş günü içerisinde teslim",
                    Cost = 0,
                    EstimatedDays = 4,
                    Provider = "Aras Kargo",
                    IsActive = true
                },
                new ShippingOption
                {
                    Id = "ship_express",
                    Name = "Express Kargo",
                    Description = "Sonraki gün teslim",
                    Cost = 49.99m,
                    EstimatedDays = 1,
                    Provider = "MNG Kargo",
                    IsActive = true
                },
                new ShippingOption
                {
                    Id = "ship_cargo",
                    Name = "Hızlı Kargo",
                    Description = "2 iş günü içerisinde teslim",
                    Cost = 29.99m,
                    EstimatedDays = 2,
                    Provider = "Yurtiçi Kargo",
                    IsActive = true
                });

            await _context.SaveChangesAsync();
        }
    }
}

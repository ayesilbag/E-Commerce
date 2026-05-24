using ECommerce.Application.Users;
using ECommerce.Application.Users.DTOs;
using ECommerce.Domain.Enums;
using ECommerce.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ECommerce.Infrastructure.Identity;

namespace ECommerce.WebServer.Endpoints;

public class UserProfile : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        var group = app.MapGroup("/api/users")
            .WithTags("Users")
            .WithOpenApi()
            .RequireAuthorization();

        group.MapGet("/profile", GetProfileAsync);
        group.MapPut("/profile", UpdateProfileAsync);
        group.MapPost("/addresses", AddAddressAsync);
        group.MapPut("/addresses/{addressId}", UpdateAddressAsync);
        group.MapDelete("/addresses/{addressId}", DeleteAddressAsync);
        group.MapPut("/preferences", UpdatePreferencesAsync);
    }

    private async Task<IResult> GetProfileAsync(
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        var user = await userManager.FindByIdAsync(userId);
        if (user is null)
            return Results.NotFound(new { success = false, error = new { code = "USER_NOT_FOUND", message = "Kullanıcı bulunamadı" } });

        var addresses = await context.Addresses
            .Where(x => x.UserId == userId)
            .Select(x => new AddressDto
            {
                Id = x.Id,
                FullName = x.FullName,
                Phone = x.Phone,
                AddressLine = x.AddressLine,
                City = x.City,
                District = x.District,
                PostalCode = x.PostalCode,
                Country = x.Country,
                IsDefault = x.IsDefault,
                Type = x.Type.ToString()
            })
            .ToListAsync(cancellationToken);

        var preferences = await context.UserPreferences
            .FirstOrDefaultAsync(x => x.UserId == userId, cancellationToken);

        var profile = new UserProfileDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email ?? "",
            Phone = user.Phone ?? "",
            Avatar = user.Avatar ?? "",
            Role = ((int)user.Role).ToString(),
            IsActive = user.IsActive,
            IsEmailVerified = user.IsEmailVerified,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Addresses = addresses.ToArray(),
            Preferences = new UserPreferencesDto
            {
                Newsletter = preferences?.Newsletter ?? true,
                Notifications = preferences?.Notifications ?? true,
                Language = preferences?.Language ?? "tr",
                Currency = preferences?.Currency ?? "TRY"
            }
        };

        return Results.Ok(new { success = true, data = profile });
    }

    private async Task<IResult> UpdateProfileAsync(
        UpdateProfileRequest request,
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        var user = await userManager.FindByIdAsync(userId);
        if (user is null)
            return Results.NotFound(new { success = false, error = new { code = "USER_NOT_FOUND", message = "Kullanıcı bulunamadı" } });

        user.FullName = request.FullName;
        user.Phone = request.Phone;
        user.Avatar = request.Avatar;

        await userManager.UpdateAsync(user);

        var profile = new
        {
            id = user.Id,
            fullName = user.FullName,
            email = user.Email
        };

        return Results.Ok(new { success = true, message = "Profil başarıyla güncellendi", data = profile });
    }

    private async Task<IResult> AddAddressAsync(
        CreateAddressRequest request,
        ApplicationDbContext context,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        var isDefault = await AddressDefaultHelper.ResolveForNewAddressAsync(
            context, userId, request.IsDefault, cancellationToken);

        var address = new Domain.Entities.Address
        {
            Id = Guid.NewGuid().ToString(),
            UserId = userId,
            FullName = request.FullName,
            Phone = request.Phone,
            AddressLine = request.Address,
            City = request.City,
            District = request.District,
            PostalCode = request.PostalCode,
            Country = request.Country,
            IsDefault = isDefault,
            Type = (AddressType)request.Type
        };

        context.Addresses.Add(address);
        await context.SaveChangesAsync(cancellationToken);

        var addressDto = new AddressDto
        {
            Id = address.Id,
            FullName = address.FullName,
            Phone = address.Phone,
            AddressLine = address.AddressLine,
            City = address.City,
            District = address.District,
            PostalCode = address.PostalCode,
            Country = address.Country,
            IsDefault = address.IsDefault,
            Type = address.Type.ToString()
        };

        return Results.Created($"/api/users/addresses/{address.Id}", new { success = true, message = "Adres başarıyla eklendi", data = new { id = address.Id, fullName = address.FullName, address = address.AddressLine } });
    }

    private async Task<IResult> UpdateAddressAsync(
        string addressId,
        UpdateAddressRequest request,
        ApplicationDbContext context,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        var address = await context.Addresses
            .FirstOrDefaultAsync(x => x.Id == addressId && x.UserId == userId, cancellationToken);

        if (address is null)
            return Results.NotFound(new { success = false, error = new { code = "ADDRESS_NOT_FOUND", message = "Adres bulunamadı" } });

        address.FullName = request.FullName;
        address.Phone = request.Phone;
        address.AddressLine = request.Address;
        address.City = request.City;
        address.District = request.District;
        address.PostalCode = request.PostalCode;
        address.Country = request.Country;

        if (request.IsDefault == true)
            await AddressDefaultHelper.SetAsDefaultAsync(context, userId, address, cancellationToken);
        else if (request.IsDefault == false)
            address.IsDefault = false;

        await context.SaveChangesAsync(cancellationToken);

        return Results.Ok(new { success = true, message = "Adres başarıyla güncellendi" });
    }

    private async Task<IResult> DeleteAddressAsync(
        string addressId,
        ApplicationDbContext context,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        var userAddresses = await context.Addresses
            .Where(x => x.UserId == userId)
            .ToListAsync(cancellationToken);

        var address = userAddresses.FirstOrDefault(x => x.Id == addressId);

        if (address is null)
            return Results.NotFound(new { success = false, error = new { code = "ADDRESS_NOT_FOUND", message = "Adres bulunamadı" } });

        context.Addresses.Remove(address);
        AddressDefaultHelper.PromoteDefaultAfterDelete(userAddresses, addressId);
        await context.SaveChangesAsync(cancellationToken);

        return Results.Ok(new { success = true, message = "Adres başarıyla silindi" });
    }

    private async Task<IResult> UpdatePreferencesAsync(
        UpdatePreferencesRequest request,
        ApplicationDbContext context,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Results.Unauthorized();

        var preferences = await context.UserPreferences
            .FirstOrDefaultAsync(x => x.UserId == userId, cancellationToken);

        if (preferences is null)
        {
            preferences = new Domain.Entities.UserPreferences
            {
                Id = Guid.NewGuid().ToString(),
                UserId = userId,
                Currency = request.Currency,
                Language = request.Language,
                Newsletter = request.Newsletter,
                Notifications = request.Notifications
            };
            context.UserPreferences.Add(preferences);
        }
        else
        {
            preferences.Currency = request.Currency;
            preferences.Language = request.Language;
            preferences.Newsletter = request.Newsletter;
            preferences.Notifications = request.Notifications;
        }

        await context.SaveChangesAsync(cancellationToken);

        return Results.Ok(new { success = true, data = new { newsletter = preferences.Newsletter, notifications = preferences.Notifications, language = preferences.Language, currency = preferences.Currency } });
    }
}

public record UpdateProfileRequest(string FullName, string? Phone, string? Avatar);
public record CreateAddressRequest(string FullName, string Phone, string Address, string City, string District, string PostalCode, string Country, bool IsDefault, int Type);
public record UpdateAddressRequest(string FullName, string Phone, string Address, string City, string District, string PostalCode, string Country, bool? IsDefault = null);
public record UpdatePreferencesRequest(bool Newsletter, bool Notifications, string Language, string Currency);

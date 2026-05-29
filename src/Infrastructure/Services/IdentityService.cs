using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Infrastructure.Identity;

namespace ECommerce.Infrastructure.Services;

public class IdentityService : IIdentityService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IUser _user;

    public IdentityService(
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager,
        IUser user)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _user = user;
    }

    public async Task<string?> GetUserNameAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        return user?.FullName;
    }

    public async Task<bool> IsInRoleAsync(string userId, string role)
    {
        var user = await _userManager.FindByIdAsync(userId);
        return user != null && await _userManager.IsInRoleAsync(user, role);
    }

    public async Task<bool> AuthorizeAsync(string userId, string policyName)
    {
        var user = await _userManager.FindByIdAsync(userId);
        return user != null;
    }

    public async Task<string> GetUserIdAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        return user?.Id ?? string.Empty;
    }

    public async Task<string> GetUserEmailAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        return user?.Email ?? string.Empty;
    }

    public async Task UpdateProfileAsync(string userId, string fullName, string? phone, string? avatar)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return;

        user.FullName = fullName;
        user.PhoneNumber = phone ?? user.PhoneNumber;
        user.Avatar = avatar ?? user.Avatar;

        await _userManager.UpdateAsync(user);
    }
}

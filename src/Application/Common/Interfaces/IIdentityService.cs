namespace ECommerce.Application.Common.Interfaces;

public interface IIdentityService
{
    Task<string?> GetUserNameAsync(string userId);
    Task<bool> IsInRoleAsync(string userId, string role);
    Task<bool> AuthorizeAsync(string userId, string policyName);
    Task<string> GetUserIdAsync(string userId);
    Task<string> GetUserEmailAsync(string userId);
    Task UpdateProfileAsync(string userId, string fullName, string? phone, string? avatar);
}

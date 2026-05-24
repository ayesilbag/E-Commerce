using System.Security.Claims;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.Users.Queries.GetUsers;

namespace ECommerce.WebServer.Services;

public class CurrentUser(IHttpContextAccessor httpContextAccessor) : IUser
{
    public string Id => httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier) 
        ?? httpContextAccessor.HttpContext?.Request.Headers["X-User-Tracking-Id"].FirstOrDefault() ?? string.Empty;
}

using System.Security.Claims;
using ECommerce.Application.Common.Interfaces;

namespace ECommerce.WebServer.Services;

public class CurrentTenant(IHttpContextAccessor httpContextAccessor) : ITenant
{
    public string? Code
    {
        get
        {
            var host = httpContextAccessor.HttpContext?.Request.Host.Value;
            
            if (string.IsNullOrEmpty(host))
                return httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            
            var tenantCode = host.Split(['.', ':'], StringSplitOptions.RemoveEmptyEntries).FirstOrDefault();

            return !string.IsNullOrEmpty(tenantCode) ? tenantCode.ToUpperInvariant() : tenantCode;
        }
    }
    
    public string? Host => httpContextAccessor.HttpContext?.Request.Host.Value;
}

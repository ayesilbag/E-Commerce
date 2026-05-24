using Microsoft.AspNetCore.Authentication.BearerToken;

namespace ECommerce.WebServer.Models;

public class LoginResponse
{
    /// <summary>
    /// Indicates whether or not the <see cref="Email"/> has been confirmed yet.
    /// </summary>
    public required AccessTokenResponse AccessToken { get; set; }
}

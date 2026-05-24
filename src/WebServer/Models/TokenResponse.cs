namespace ECommerce.WebServer.Models;

public class TokenResponse
{
    public string TokenType { get; } = "Bearer";

    public required string AccessToken { get; init; }

    public long ExpiresIn { get; init; }

    public required string RefreshToken { get; set; }
}

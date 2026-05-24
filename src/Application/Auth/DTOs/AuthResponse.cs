namespace ECommerce.Application.Auth.DTOs;

public class AuthResponse
{
    public required UserDto User { get; set; }
    public required TokensDto Tokens { get; set; }
}

public class UserDto
{
    public required string Id { get; set; }
    public required string Email { get; set; }
    public required string FullName { get; set; }
    public string? Phone { get; set; }
    public string? Avatar { get; set; }
    public string Role { get; set; } = "Customer";
}

public class TokensDto
{
    public required string AccessToken { get; set; }
    public required string RefreshToken { get; set; }
    public int ExpiresIn { get; set; } = 3600;
}

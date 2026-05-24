namespace ECommerce.Application.Users.Queries.GetUsers;

public class UserDto
{
    public required string Id { get; set; }
    public required string Email { get; set; }
    public required string FullName { get; set; }
    public string? Phone { get; set; }
    public string? Avatar { get; set; }
    public required string Role { get; set; }
    public bool IsActive { get; set; }
    public bool IsEmailVerified { get; set; }
}

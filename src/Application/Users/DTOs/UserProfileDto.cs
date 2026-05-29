using ECommerce.Application.Common.DTOs;

namespace ECommerce.Application.Users.DTOs;

public class UserProfileDto
{
    public required string Id { get; set; }
    public required string FullName { get; set; }
    public required string Email { get; set; }
    public string? Phone { get; set; }
    public string? Avatar { get; set; }
    public required string Role { get; set; }
    public bool IsActive { get; set; }
    public bool EmailConfirmed { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public required AddressDto[] Addresses { get; set; }
    public required UserPreferencesDto Preferences { get; set; }
}

public class UpdateProfileRequest
{
    public required string FullName { get; set; }
    public string? Phone { get; set; }
    public string? Avatar { get; set; }
}

public class CreateAddressRequest
{
    public required string FullName { get; set; }
    public required string Phone { get; set; }
    public required string AddressLine { get; set; }
    public required string City { get; set; }
    public required string District { get; set; }
    public required string PostalCode { get; set; }
    public required string Country { get; set; }
    public bool IsDefault { get; set; } = false;
    public required string Type { get; set; }
}

public class UpdateAddressRequest
{
    public required string FullName { get; set; }
    public required string Phone { get; set; }
    public required string AddressLine { get; set; }
}

public class UpdatePreferencesRequest
{
    public bool Newsletter { get; set; } = true;
    public bool Notifications { get; set; } = true;
    public string Language { get; set; } = "tr";
    public string Currency { get; set; } = "TRY";
}

public class UserPreferencesDto
{
    public bool Newsletter { get; set; }
    public bool Notifications { get; set; }
    public required string Language { get; set; }
    public required string Currency { get; set; }
}

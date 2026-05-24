using ECommerce.Application.Users.DTOs;

namespace ECommerce.Application.Users.Commands.UpdateProfile;

public record UpdateProfileCommand(UpdateProfileRequest Request) : IRequest<UserProfileDto>;

public class UpdateProfileCommandHandler : IRequestHandler<UpdateProfileCommand, UserProfileDto>
{
    private readonly IIdentityService _identityService;
    private readonly IUser _currentUser;

    public UpdateProfileCommandHandler(IIdentityService identityService, IUser currentUser)
    {
        _identityService = identityService;
        _currentUser = currentUser;
    }

    public async Task<UserProfileDto> Handle(UpdateProfileCommand command, CancellationToken cancellationToken)
    {
        await _identityService.UpdateProfileAsync(_currentUser.Id, command.Request.FullName, command.Request.Phone, command.Request.Avatar);

        var email = await _identityService.GetUserEmailAsync(_currentUser.Id);
        var userId = await _identityService.GetUserIdAsync(_currentUser.Id);

        return new UserProfileDto
        {
            Id = userId,
            FullName = command.Request.FullName,
            Email = email,
            Phone = command.Request.Phone,
            Avatar = command.Request.Avatar,
            Role = "Customer",
            IsActive = true,
            IsEmailVerified = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Addresses = Array.Empty<AddressDto>(),
            Preferences = new UserPreferencesDto
            {
                Newsletter = true,
                Notifications = true,
                Language = "tr",
                Currency = "TRY"
            }
        };
    }
}

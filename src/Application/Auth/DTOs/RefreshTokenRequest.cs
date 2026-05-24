using FluentValidation;

namespace ECommerce.Application.Auth.DTOs;

public class RefreshTokenRequest
{
    public required string RefreshToken { get; set; }
}

public class RefreshTokenRequestValidator : AbstractValidator<RefreshTokenRequest>
{
    public RefreshTokenRequestValidator()
    {
        RuleFor(x => x.RefreshToken)
            .NotEmpty().WithMessage("RefreshToken is required");
    }
}

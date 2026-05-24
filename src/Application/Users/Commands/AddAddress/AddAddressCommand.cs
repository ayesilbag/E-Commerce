using ECommerce.Application.Common.DTOs;
using ECommerce.Application.Users;
using ECommerce.Application.Users.DTOs;

namespace ECommerce.Application.Users.Commands.AddAddress;

public record AddAddressCommand(CreateAddressRequest Request) : IRequest<AddressDto>;

public class AddAddressCommandHandler : IRequestHandler<AddAddressCommand, AddressDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IUser _currentUser;

    public AddAddressCommandHandler(IApplicationDbContext context, IUser currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<AddressDto> Handle(AddAddressCommand command, CancellationToken cancellationToken)
    {
        var isDefault = await AddressDefaultHelper.ResolveForNewAddressAsync(
            _context, _currentUser.Id!, command.Request.IsDefault, cancellationToken);

        var address = new Domain.Entities.Address
        {
            UserId = _currentUser.Id,
            FullName = command.Request.FullName,
            Phone = command.Request.Phone,
            AddressLine = command.Request.AddressLine,
            City = command.Request.City,
            District = command.Request.District,
            PostalCode = command.Request.PostalCode,
            Country = command.Request.Country,
            IsDefault = isDefault,
            Type = Enum.Parse<AddressType>(command.Request.Type)
        };

        _context.Addresses.Add(address);
        await _context.SaveChangesAsync(cancellationToken);

        return new AddressDto
        {
            Id = address.Id,
            FullName = address.FullName,
            Phone = address.Phone,
            AddressLine = address.AddressLine,
            City = address.City,
            District = address.District,
            PostalCode = address.PostalCode,
            Country = address.Country,
            IsDefault = address.IsDefault,
            Type = address.Type.ToString()
        };
    }
}

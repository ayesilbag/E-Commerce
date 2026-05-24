using ECommerce.Domain.Enums;

namespace ECommerce.Domain.Entities;

public class Address : BaseEntity
{
    public required string UserId { get; set; }
    public required string FullName { get; set; }
    public required string Phone { get; set; }
    public required string AddressLine { get; set; }
    public required string City { get; set; }
    public required string District { get; set; }
    public required string PostalCode { get; set; }
    public required string Country { get; set; }
    public bool IsDefault { get; set; } = false;
    public AddressType Type { get; set; } = AddressType.Home;
}

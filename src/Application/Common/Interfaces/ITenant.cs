namespace ECommerce.Application.Common.Interfaces;

public interface ITenant
{
    string? Code { get; }
    string? Host { get; }
}

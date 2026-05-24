using ECommerce.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Application.Users;

public static class AddressDefaultHelper
{
    /// <summary>
    /// Resolves IsDefault for a new address. Clears existing defaults in the database first
    /// so the filtered unique index is not violated during SaveChanges.
    /// </summary>
    public static async Task<bool> ResolveForNewAddressAsync(
        IApplicationDbContext context,
        string userId,
        bool requestedIsDefault,
        CancellationToken cancellationToken)
    {
        var hasAddresses = await context.Addresses
            .AnyAsync(a => a.UserId == userId, cancellationToken);

        if (!hasAddresses)
            return true;

        if (!requestedIsDefault)
            return false;

        await ClearDefaultsInDatabaseAsync(context, userId, cancellationToken);
        return true;
    }

    /// <summary>
    /// Marks an address as default. Clears other defaults in the database first (single statement),
    /// then sets the target entity so SaveChanges only promotes one row.
    /// </summary>
    public static async Task SetAsDefaultAsync(
        IApplicationDbContext context,
        string userId,
        Domain.Entities.Address address,
        CancellationToken cancellationToken)
    {
        await ClearDefaultsInDatabaseAsync(context, userId, cancellationToken);
        address.IsDefault = true;
    }

    /// <summary>
    /// After deleting the default address, promotes another address if any remain.
    /// </summary>
    public static void PromoteDefaultAfterDelete(IReadOnlyList<Domain.Entities.Address> userAddresses, string deletedAddressId)
    {
        var remaining = userAddresses.Where(a => a.Id != deletedAddressId).ToList();
        if (remaining.Count == 0 || remaining.Any(a => a.IsDefault))
            return;

        remaining[0].IsDefault = true;
    }

    private static Task ClearDefaultsInDatabaseAsync(
        IApplicationDbContext context,
        string userId,
        CancellationToken cancellationToken) =>
        context.Addresses
            .Where(a => a.UserId == userId && a.IsDefault)
            .ExecuteUpdateAsync(s => s.SetProperty(a => a.IsDefault, false), cancellationToken);
}

using ECommerce.Application.Payments;
using ECommerce.Application.Payments.DTOs;
using ECommerce.Domain.Constants;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.WebServer.Endpoints;

public class AdminBankAccounts : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        var group = app.MapGroup("/api/admin/bank-accounts")
            .WithTags("Admin")
            .WithOpenApi()
            .RequireAuthorization(Policies.Admin);

        group.MapGet("/", ListAsync);
        group.MapPost("/", CreateAsync);
        group.MapPut("/{id}", UpdateAsync);
        group.MapDelete("/{id}", DeleteAsync);
    }

    private static async Task<IResult> ListAsync(
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        var accounts = await context.BankAccounts
            .OrderBy(a => a.SortOrder)
            .ThenBy(a => a.BankName)
            .ToListAsync(cancellationToken);

        return Results.Ok(new
        {
            success = true,
            data = accounts.Select(BankAccountRules.ToDto)
        });
    }

    private static async Task<IResult> CreateAsync(
        AdminBankAccountRequest request,
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        var validation = ValidateRequest(request);
        if (validation is not null)
            return validation;

        if (!BankAccountRules.TryNormalizeIban(request.Iban!, out var iban, out var ibanError))
            return Results.BadRequest(new { success = false, message = ibanError });

        var account = new BankAccount
        {
            Id = Guid.NewGuid().ToString(),
            BankName = request.BankName!.Trim(),
            AccountHolder = request.AccountHolder!.Trim(),
            Iban = iban,
            BranchName = string.IsNullOrWhiteSpace(request.BranchName) ? null : request.BranchName.Trim(),
            Currency = string.IsNullOrWhiteSpace(request.Currency) ? "TRY" : request.Currency.Trim().ToUpperInvariant(),
            Instructions = string.IsNullOrWhiteSpace(request.Instructions) ? null : request.Instructions.Trim(),
            SortOrder = request.SortOrder,
            IsActive = request.IsActive
        };

        context.BankAccounts.Add(account);
        await context.SaveChangesAsync(cancellationToken);

        return Results.Created($"/api/admin/bank-accounts/{account.Id}", new { success = true, data = BankAccountRules.ToDto(account) });
    }

    private static async Task<IResult> UpdateAsync(
        string id,
        AdminBankAccountRequest request,
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        var account = await context.BankAccounts.FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
        if (account is null)
            return Results.NotFound(new { success = false, message = "Banka hesabı bulunamadı" });

        var validation = ValidateRequest(request, isUpdate: true);
        if (validation is not null)
            return validation;

        if (!string.IsNullOrWhiteSpace(request.Iban))
        {
            if (!BankAccountRules.TryNormalizeIban(request.Iban, out var iban, out var ibanError))
                return Results.BadRequest(new { success = false, message = ibanError });
            account.Iban = iban;
        }

        account.BankName = request.BankName!.Trim();
        account.AccountHolder = request.AccountHolder!.Trim();
        account.BranchName = string.IsNullOrWhiteSpace(request.BranchName) ? null : request.BranchName.Trim();
        account.Currency = string.IsNullOrWhiteSpace(request.Currency) ? account.Currency : request.Currency.Trim().ToUpperInvariant();
        account.Instructions = string.IsNullOrWhiteSpace(request.Instructions) ? null : request.Instructions.Trim();
        account.SortOrder = request.SortOrder;
        account.IsActive = request.IsActive;

        await context.SaveChangesAsync(cancellationToken);
        return Results.Ok(new { success = true, data = BankAccountRules.ToDto(account) });
    }

    private static async Task<IResult> DeleteAsync(
        string id,
        ApplicationDbContext context,
        CancellationToken cancellationToken)
    {
        var account = await context.BankAccounts.FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
        if (account is null)
            return Results.NotFound(new { success = false, message = "Banka hesabı bulunamadı" });

        context.BankAccounts.Remove(account);
        await context.SaveChangesAsync(cancellationToken);
        return Results.Ok(new { success = true, message = "Silindi" });
    }

    private static IResult? ValidateRequest(AdminBankAccountRequest request, bool isUpdate = false)
    {
        if (string.IsNullOrWhiteSpace(request.BankName))
            return Results.BadRequest(new { success = false, message = "Banka adı zorunludur" });

        if (string.IsNullOrWhiteSpace(request.AccountHolder))
            return Results.BadRequest(new { success = false, message = "Hesap sahibi zorunludur" });

        if (!isUpdate && string.IsNullOrWhiteSpace(request.Iban))
            return Results.BadRequest(new { success = false, message = "IBAN zorunludur" });

        return null;
    }
}

public class AdminBankAccountRequest
{
    public string? BankName { get; set; }
    public string? AccountHolder { get; set; }
    public string? Iban { get; set; }
    public string? BranchName { get; set; }
    public string? Currency { get; set; }
    public string? Instructions { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

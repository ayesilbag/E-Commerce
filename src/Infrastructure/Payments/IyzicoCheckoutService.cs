using ECommerce.Application.Payments;
using ECommerce.Application.Payments.DTOs;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Enums;
using ECommerce.Infrastructure.Data;
using Iyzipay.Model;
using Iyzipay.Request;
using Microsoft.EntityFrameworkCore;
using IyzipayAddress = Iyzipay.Model.Address;
using IyzipayBuyer = Iyzipay.Model.Buyer;
using IyzipayOptions = Iyzipay.Options;

namespace ECommerce.Infrastructure.Payments;

public class IyzicoCheckoutService(ApplicationDbContext context) : IIyzicoCheckoutService
{
    public async Task<IyzicoInitializeResponse> InitializeAsync(
        Order order,
        PaymentClient client,
        ApplicationUserInfo buyer,
        string callbackUrl,
        CancellationToken cancellationToken)
    {
        var options = CreateOptions(client);
        var paidPrice = order.Total.ToString("0.##", System.Globalization.CultureInfo.InvariantCulture);
        var price = order.Subtotal.ToString("0.##", System.Globalization.CultureInfo.InvariantCulture);

        var currency = PaymentClientRules.NormalizeCurrency(client.Currency);

        var request = new CreateCheckoutFormInitializeRequest
        {
            Locale = client.Locale.Equals("en", StringComparison.OrdinalIgnoreCase) ? Locale.EN.ToString() : Locale.TR.ToString(),
            ConversationId = order.Id,
            Price = price,
            PaidPrice = paidPrice,
            Currency = currency,
            BasketId = order.Id,
            PaymentGroup = PaymentGroup.PRODUCT.ToString(),
            CallbackUrl = callbackUrl
        };

        var installments = PaymentClientRules.ParseInstallments(client.EnabledInstallments);
        if (installments.Count > 0)
            request.EnabledInstallments = installments;

        var (firstName, lastName) = SplitName(buyer.FullName);
        var addressLine = FormatAddress(order.ShippingAddress);

        request.Buyer = new IyzipayBuyer
        {
            Id = buyer.Id,
            Name = firstName,
            Surname = lastName,
            Email = buyer.Email,
            GsmNumber = FormatPhone(buyer.Phone),
            IdentityNumber = "11111111111",
            RegistrationAddress = addressLine,
            City = order.ShippingAddress.City,
            Country = order.ShippingAddress.Country,
            ZipCode = order.ShippingAddress.PostalCode,
            Ip = buyer.Ip
        };

        request.ShippingAddress = new IyzipayAddress
        {
            ContactName = order.ShippingAddress.FullName,
            City = order.ShippingAddress.City,
            Country = order.ShippingAddress.Country,
            Description = addressLine,
            ZipCode = order.ShippingAddress.PostalCode
        };

        request.BillingAddress = new IyzipayAddress
        {
            ContactName = order.ShippingAddress.FullName,
            City = order.ShippingAddress.City,
            Country = order.ShippingAddress.Country,
            Description = addressLine,
            ZipCode = order.ShippingAddress.PostalCode
        };

        request.BasketItems = order.Items.Select(item => new BasketItem
        {
            Id = item.ProductId,
            Name = item.ProductName,
            Category1 = "General",
            ItemType = BasketItemType.PHYSICAL.ToString(),
            Price = item.Subtotal.ToString("0.##", System.Globalization.CultureInfo.InvariantCulture)
        }).ToList();

        var response = await CheckoutFormInitialize.Create(request, options);

        if (!string.Equals(response.Status, Status.SUCCESS.ToString(), StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException(response.ErrorMessage ?? "iyzico ödeme formu başlatılamadı");
        }

        if (string.IsNullOrEmpty(response.Token) || string.IsNullOrEmpty(response.PaymentPageUrl))
            throw new InvalidOperationException("iyzico yanıtında token veya paymentPageUrl eksik");

        var existingSession = await context.PaymentSessions
            .FirstOrDefaultAsync(s => s.OrderId == order.Id && s.Status == PaymentSessionStatus.Initialized, cancellationToken);

        if (existingSession is not null)
        {
            existingSession.Token = response.Token;
            existingSession.ConversationId = order.Id;
            existingSession.Price = order.Subtotal;
            existingSession.PaidPrice = order.Total;
        }
        else
        {
            context.PaymentSessions.Add(new PaymentSession
            {
                Id = Guid.NewGuid().ToString(),
                OrderId = order.Id,
                PaymentClientId = client.Id,
                ConversationId = order.Id,
                Token = response.Token,
                Price = order.Subtotal,
                PaidPrice = order.Total,
                Currency = currency,
                Status = PaymentSessionStatus.Initialized
            });
        }

        await context.SaveChangesAsync(cancellationToken);

        return new IyzicoInitializeResponse
        {
            Token = response.Token,
            PaymentPageUrl = response.PaymentPageUrl,
            CheckoutFormContent = response.CheckoutFormContent,
            PaymentClientCode = client.Code,
            ConversationId = order.Id
        };
    }

    public async Task<IyzicoCallbackResult> CompleteCallbackAsync(
        PaymentClient client,
        string token,
        CancellationToken cancellationToken)
    {
        var session = await context.PaymentSessions
            .Include(s => s.Order)
            .ThenInclude(o => o.Items)
            .Include(s => s.PaymentClient)
            .FirstOrDefaultAsync(s => s.Token == token, cancellationToken);

        if (session is null)
        {
            return new IyzicoCallbackResult
            {
                Success = false,
                OrderId = string.Empty,
                Message = "Ödeme oturumu bulunamadı"
            };
        }

        var options = CreateOptions(client);
        var retrieveRequest = new RetrieveCheckoutFormRequest
        {
            Locale = client.Locale.Equals("en", StringComparison.OrdinalIgnoreCase) ? Locale.EN.ToString() : Locale.TR.ToString(),
            ConversationId = session.ConversationId,
            Token = token
        };

        var checkoutForm = await CheckoutForm.Retrieve(retrieveRequest, options);

        session.IyzicoPaymentStatus = checkoutForm.PaymentStatus;
        session.IyzicoPaymentId = checkoutForm.PaymentId;

        var success = string.Equals(checkoutForm.PaymentStatus, "SUCCESS", StringComparison.OrdinalIgnoreCase)
                      && string.Equals(checkoutForm.Status, Status.SUCCESS.ToString(), StringComparison.OrdinalIgnoreCase);

        if (success)
        {
            var paidPrice = decimal.TryParse(checkoutForm.PaidPrice, System.Globalization.NumberStyles.Any,
                System.Globalization.CultureInfo.InvariantCulture, out var parsedPaid)
                ? parsedPaid
                : session.PaidPrice;
            if (Math.Abs(paidPrice - session.Order.Total) > 0.01m)
            {
                session.Status = PaymentSessionStatus.Failed;
                session.ErrorMessage = "Ödeme tutarı sipariş tutarı ile eşleşmiyor";
                await context.SaveChangesAsync(cancellationToken);

                return new IyzicoCallbackResult
                {
                    Success = false,
                    OrderId = session.OrderId,
                    Message = session.ErrorMessage,
                    RedirectUrl = BuildRedirectUrl(client.FailureRedirectUrl, session.OrderId)
                };
            }

            session.Status = PaymentSessionStatus.Completed;
            session.Order.PaymentStatus = PaymentStatus.Completed;
            session.Order.Status = OrderStatus.Confirmed;
            session.Order.TransactionId = checkoutForm.PaymentId;
            session.Order.PaidAt = DateTime.UtcNow;
            session.Order.PaymentMethod = new PaymentMethod
            {
                Type = "iyzico",
                CardBrand = checkoutForm.CardAssociation,
                CardLast4 = checkoutForm.LastFourDigits
            };
        }
        else
        {
            session.Status = PaymentSessionStatus.Failed;
            session.ErrorMessage = checkoutForm.ErrorMessage ?? checkoutForm.PaymentStatus ?? "Ödeme başarısız";
            session.Order.PaymentStatus = PaymentStatus.Failed;
        }

        await context.SaveChangesAsync(cancellationToken);

        return new IyzicoCallbackResult
        {
            Success = success,
            OrderId = session.OrderId,
            PaymentId = checkoutForm.PaymentId,
            Message = success ? "Ödeme başarılı" : session.ErrorMessage,
            RedirectUrl = BuildRedirectUrl(
                success ? client.SuccessRedirectUrl : client.FailureRedirectUrl,
                session.OrderId)
        };
    }

    private static IyzipayOptions CreateOptions(PaymentClient client) => new()
    {
        ApiKey = client.ApiKey,
        SecretKey = client.SecretKey,
        BaseUrl = PaymentClientRules.GetBaseUrl(client)
    };

    private static string? BuildRedirectUrl(string? template, string orderId) =>
        string.IsNullOrWhiteSpace(template) ? null : template.Replace("{orderId}", orderId, StringComparison.Ordinal);

    private static (string First, string Last) SplitName(string fullName)
    {
        var parts = fullName.Trim().Split(' ', 2, StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length == 0)
            return ("Müşteri", "Kullanıcı");
        if (parts.Length == 1)
            return (parts[0], ".");
        return (parts[0], parts[1]);
    }

    private static string FormatAddress(Domain.Entities.Address address) =>
        $"{address.AddressLine}, {address.District}, {address.City} {address.PostalCode}, {address.Country}";

    private static string FormatPhone(string? phone)
    {
        if (string.IsNullOrWhiteSpace(phone))
            return "+905000000000";

        var digits = new string(phone.Where(char.IsDigit).ToArray());
        if (digits.StartsWith("90"))
            return "+" + digits;
        if (digits.StartsWith('0'))
            return "+9" + digits;
        if (digits.Length == 10)
            return "+90" + digits;
        return phone.StartsWith('+') ? phone : "+" + digits;
    }
}

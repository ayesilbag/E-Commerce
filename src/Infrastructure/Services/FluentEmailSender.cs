using System.Net;
using System.Text;
using FluentEmail.Core;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using ECommerce.Infrastructure.Email;
using ECommerce.Infrastructure.Identity;

namespace ECommerce.Infrastructure.Services;

public class FluentEmailSender : IEmailSender<ApplicationUser>
{
    private readonly IFluentEmailFactory _fluentEmailFactory;
    private readonly EmailTemplateRenderer _templateRenderer;
    private readonly IConfiguration _configuration;

    public FluentEmailSender(
        IFluentEmailFactory fluentEmailFactory,
        EmailTemplateRenderer templateRenderer,
        IConfiguration configuration)
    {
        _fluentEmailFactory = fluentEmailFactory;
        _templateRenderer = templateRenderer;
        _configuration = configuration;
    }

    public Task SendConfirmationLinkAsync(ApplicationUser user, string email, string confirmationLink)
    {
        var pageLink = BuildEmailConfirmationPageLink(confirmationLink);
        var model = _templateRenderer.CreateConfirmationModel(user.FullName, pageLink);
        return SendAsync(email, "E-posta doğrulama", _templateRenderer.Render(model));
    }

    public Task SendPasswordResetLinkAsync(ApplicationUser user, string email, string resetLink)
    {
        var model = _templateRenderer.CreatePasswordResetLinkModel(user.FullName, resetLink);
        return SendAsync(email, "Şifre sıfırlama", _templateRenderer.Render(model));
    }

    public Task SendPasswordResetCodeAsync(ApplicationUser user, string email, string resetCode)
    {
        // MapIdentityApi sends an encoded token, not a user-facing code. Build a reset link instead.
        var code = WebUtility.HtmlDecode(resetCode);
        var resetLink = BuildPasswordResetLink(email, code);
        var model = _templateRenderer.CreatePasswordResetLinkModel(user.FullName, resetLink);
        return SendAsync(email, "Şifre sıfırlama", _templateRenderer.Render(model));
    }

    private string BuildEmailConfirmationPageLink(string confirmationLink)
    {
        var link = WebUtility.HtmlDecode(confirmationLink);
        var uri = new Uri(link);

        var baseUrl = _configuration["EmailSettings:FrontendBaseUrl"]?.TrimEnd('/')
            ?? $"{uri.Scheme}://{uri.Authority}";

        var path = _configuration["EmailSettings:EmailConfirmPath"] ?? "/confirm-email.html";
        if (!path.StartsWith('/'))
            path = "/" + path;

        var query = new StringBuilder();
        AppendQueryParam(query, "userId", GetQueryParam(link, "userId"));
        AppendQueryParam(query, "code", GetQueryParam(link, "code"));
        AppendQueryParam(query, "changedEmail", GetQueryParam(link, "changedEmail"));

        return query.Length == 0
            ? $"{baseUrl}{path}"
            : $"{baseUrl}{path}?{query}";
    }

    private static string? GetQueryParam(string link, string name)
    {
        var queryIndex = link.IndexOf('?', StringComparison.Ordinal);
        if (queryIndex < 0)
            return null;

        var query = link[(queryIndex + 1)..];
        foreach (var part in query.Split('&', StringSplitOptions.RemoveEmptyEntries))
        {
            var separator = part.IndexOf('=');
            if (separator <= 0)
                continue;

            var key = Uri.UnescapeDataString(part[..separator]);
            if (!string.Equals(key, name, StringComparison.OrdinalIgnoreCase))
                continue;

            return Uri.UnescapeDataString(part[(separator + 1)..]);
        }

        return null;
    }

    private static void AppendQueryParam(StringBuilder query, string name, string? value)
    {
        if (string.IsNullOrEmpty(value))
            return;

        if (query.Length > 0)
            query.Append('&');

        query.Append(Uri.EscapeDataString(name));
        query.Append('=');
        query.Append(Uri.EscapeDataString(value));
    }

    private string BuildPasswordResetLink(string email, string resetCode)
    {
        var baseUrl = _configuration["EmailSettings:FrontendBaseUrl"]?.TrimEnd('/')
            ?? throw new InvalidOperationException("EmailSettings:FrontendBaseUrl yapılandırması eksik.");

        var path = _configuration["EmailSettings:PasswordResetPath"] ?? "/reset-password.html";
        if (!path.StartsWith('/'))
            path = "/" + path;

        return $"{baseUrl}{path}?email={Uri.EscapeDataString(email)}&code={Uri.EscapeDataString(resetCode)}";
    }

    private async Task SendAsync(string email, string subject, string htmlBody)
    {
        var response = await _fluentEmailFactory
            .Create()
            .To(email)
            .Subject(subject)
            .Body(htmlBody, isHtml: true)
            .SendAsync();

        if (!response.Successful)
        {
            var errors = string.Join(", ", response.ErrorMessages);
            throw new InvalidOperationException($"E-posta gönderilemedi: {errors}");
        }
    }
}

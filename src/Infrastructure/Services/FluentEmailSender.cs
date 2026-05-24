using FluentEmail.Core;
using Microsoft.AspNetCore.Identity;
using ECommerce.Infrastructure.Email;
using ECommerce.Infrastructure.Identity;

namespace ECommerce.Infrastructure.Services;

public class FluentEmailSender : IEmailSender<ApplicationUser>
{
    private readonly IFluentEmailFactory _fluentEmailFactory;
    private readonly EmailTemplateRenderer _templateRenderer;

    public FluentEmailSender(IFluentEmailFactory fluentEmailFactory, EmailTemplateRenderer templateRenderer)
    {
        _fluentEmailFactory = fluentEmailFactory;
        _templateRenderer = templateRenderer;
    }

    public Task SendConfirmationLinkAsync(ApplicationUser user, string email, string confirmationLink)
    {
        var model = _templateRenderer.CreateConfirmationModel(user.FullName, confirmationLink);
        return SendAsync(email, "E-posta doğrulama", _templateRenderer.Render(model));
    }

    public Task SendPasswordResetLinkAsync(ApplicationUser user, string email, string resetLink)
    {
        var model = _templateRenderer.CreatePasswordResetLinkModel(user.FullName, resetLink);
        return SendAsync(email, "Şifre sıfırlama", _templateRenderer.Render(model));
    }

    public Task SendPasswordResetCodeAsync(ApplicationUser user, string email, string resetCode)
    {
        var model = _templateRenderer.CreatePasswordResetCodeModel(user.FullName, resetCode);
        return SendAsync(email, "Şifre sıfırlama kodu", _templateRenderer.Render(model));
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

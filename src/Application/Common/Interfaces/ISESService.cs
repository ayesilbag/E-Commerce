using ECommerce.Application.Mail.Commands;

namespace ECommerce.Application.Common.Interfaces;
public interface ISESService
{
    Task<string> SendEmailAsync(SenderCommand command);
}

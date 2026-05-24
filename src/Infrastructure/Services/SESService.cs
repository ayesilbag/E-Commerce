using Amazon.SimpleEmail;
using Amazon.SimpleEmail.Model;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.Mail.Commands;

namespace ECommerce.Infrastructure.Services;

public class SESService : ISESService
{
    private readonly IAmazonSimpleEmailService _sesClient;
    private readonly string _defaultFromEmail;

    public SESService(IAmazonSimpleEmailService sesClient, IConfiguration configuration)
    {
        _sesClient = sesClient;
        _defaultFromEmail = configuration["MailSettings:From"] ?? "noreply@example.com";
    }

    public async Task<string> SendEmailAsync(SenderCommand command)
    {
        var sendRequest = new SendEmailRequest
        {
            Source = _defaultFromEmail,
            Destination = new Destination
            {
                ToAddresses = new List<string> { command.To ?? string.Empty }
            },
            Message = new Message
            {
                Subject = new Content(command.Subject ?? string.Empty),
                Body = new Body
                {
                    Html = new Content
                    {
                        Charset = "UTF-8",
                        Data = command.Body ?? string.Empty
                    }
                }
            }
        };

        var response = await _sesClient.SendEmailAsync(sendRequest);
        return response.MessageId;
    }
}

using ECommerce.Application.Common.Interfaces;

namespace ECommerce.Application.Mail.Commands;

public record SenderCommand : IRequest<string>
{
    public string? To { get; set; }
    public string? Subject { get; set; }
    public string? Body { get; set; }
}

public class SenderCommandHandler : IRequestHandler<SenderCommand, string>
{
    private readonly ISESService _service;

    public SenderCommandHandler(ISESService service)
    {
        _service = service;
    }

    public async Task<string> Handle(SenderCommand request, CancellationToken cancellationToken)
    {
        return await _service.SendEmailAsync(request);
    }
}

using ECommerce.Application.Common.Interfaces;

namespace ECommerce.Application.Attachments.Commands.DeleteAttachment;

public record DeleteAttachmentCommand(string Id) : IRequest<Unit>;

public class DeleteAttachmentCommandHandler(IApplicationDbContext context) : IRequestHandler<DeleteAttachmentCommand, Unit>
{
    public async Task<Unit> Handle(DeleteAttachmentCommand request, CancellationToken cancellationToken)
    {
        var attachment = await context.Attachments
            .FindAsync(new object[] { request.Id }, cancellationToken);

        if (attachment is null)
            return Unit.Value;

        context.Attachments.Remove(attachment);
        await context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}

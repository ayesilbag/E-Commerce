using ECommerce.Application.Common.Interfaces;
using ECommerce.Domain.Constants;
using ECommerce.WebServer.Configuration;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;

namespace ECommerce.WebServer.Endpoints;

public class AdminMedia : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        var group = app.MapGroup("/api/admin/media")
            .WithTags("Admin")
            .WithOpenApi()
            .RequireAuthorization(Policies.Admin)
            .DisableAntiforgery();

        group.MapPost("/upload", UploadAsync);
    }

    private static async Task<IResult> UploadAsync(
        IFormFile file,
        ILocalFileStorage fileStorage,
        IOptions<FileStorageOptions> options,
        [FromQuery] string folder = "products",
        [FromQuery] string? productId = null,
        CancellationToken cancellationToken = default)
    {
        if (file is null || file.Length == 0)
        {
            return Results.BadRequest(new { success = false, error = new { code = "NO_FILE", message = "Dosya gerekli" } });
        }

        if (file.Length > options.Value.MaxFileSizeBytes)
        {
            return Results.BadRequest(new { success = false, error = new { code = "FILE_TOO_LARGE", message = "Dosya boyutu çok büyük" } });
        }

        var allowedFolders = new[] { "products", "categories", "site" };
        if (!allowedFolders.Contains(folder, StringComparer.OrdinalIgnoreCase))
        {
            return Results.BadRequest(new { success = false, error = new { code = "INVALID_FOLDER", message = "Geçersiz klasör" } });
        }

        await using var stream = file.OpenReadStream();
        var result = await fileStorage.SaveAsync(
            stream,
            file.FileName,
            file.ContentType,
            folder.ToLowerInvariant(),
            productId,
            cancellationToken);

        return Results.Ok(new { success = true, data = result });
    }
}

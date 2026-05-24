using ECommerce.Application.Common.Interfaces;
using ECommerce.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ECommerce.Infrastructure.Identity;

namespace ECommerce.WebServer.Endpoints;

public class Files : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        var group = app.MapGroup("/api/files")
            .WithTags("Files")
            .WithOpenApi()
            .DisableAntiforgery();

        group.MapPost("/upload", UploadFileAsync);
        group.MapDelete("/{id}", DeleteFileAsync);
        group.MapGet("/config/s3-url", GetS3BaseUrl);
    }

    private IResult GetS3BaseUrl(IConfiguration config)
    {
        var region = config["AWS:Region"] ?? "eu-central-1";
        var bucketName = config["S3Settings:BucketName"] ?? "";

        if (string.IsNullOrEmpty(bucketName))
        {
            return Results.BadRequest(new { success = false, error = new { code = "S3_NOT_CONFIGURED", message = "S3 bucket name not configured" } });
        }

        var s3BaseUrl = $"https://{bucketName}.s3.{region}.amazonaws.com/";
        return Results.Ok(new { success = true, data = new { baseUrl = s3BaseUrl } });
    }

    private async Task<IResult> UploadFileAsync(
        IFormFile file,
        [FromQuery] string dialogId,
        IS3Service s3Service,
        ApplicationDbContext context,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        try
        {
            if (file == null || file.Length == 0)
            {
                return Results.BadRequest(new { success = false, error = new { code = "NO_FILE", message = "File is required" } });
            }

            // Validate file size (max 50MB)
            const long maxFileSize = 50 * 1024 * 1024;
            if (file.Length > maxFileSize)
            {
                return Results.BadRequest(new { success = false, error = new { code = "FILE_TOO_LARGE", message = "File size exceeds the maximum allowed size of 50MB" } });
            }

            var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Results.Unauthorized();
            }

            if (string.IsNullOrEmpty(dialogId))
            {
                return Results.BadRequest(new { success = false, error = new { code = "NO_DIALOG_ID", message = "DialogId is required" } });
            }

            // Open the stream and copy to memory immediately to avoid stream disposal issues
            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream, cancellationToken);
            memoryStream.Position = 0;

            // Upload to S3
            var uploadResult = await s3Service.UploadFileAsync(
                memoryStream,
                file.FileName,
                file.ContentType,
                cancellationToken);

            // Create attachment record
            var attachment = new Domain.Entities.Attachment
            {
                Id = Guid.NewGuid().ToString(),
                UserId = userId,
                DialogId = dialogId,
                Extension = Path.GetExtension(file.FileName),
                FileName = file.FileName,
                ContentType = file.ContentType,
                FileKey = uploadResult.FileKey,
                FileUrl = uploadResult.FileUrl,
                FileSize = uploadResult.FileSize,
                Created = DateTimeOffset.UtcNow
            };

            context.Attachments.Add(attachment);
            await context.SaveChangesAsync(cancellationToken);

            var response = new
            {
                id = attachment.Id,
                userId = attachment.UserId,
                dialogId = attachment.DialogId,
                extension = attachment.Extension,
                fileName = attachment.FileName,
                contentType = attachment.ContentType,
                url = attachment.FileUrl,
                fileSize = attachment.FileSize,
                type = GetMediaType(attachment.Extension)
            };

            return Results.Ok(new { success = true, data = response });
        }
        catch (Exception ex)
        {
            // Log the exception
            Console.Error.WriteLine($"File upload error: {ex.Message}");
            return Results.Json(
                new { success = false, error = new { code = "UPLOAD_FAILED", message = "File upload failed", details = ex.Message } },
                statusCode: StatusCodes.Status500InternalServerError);
        }
    }

    private async Task<IResult> DeleteFileAsync(
        string id,
        IS3Service s3Service,
        ApplicationDbContext context,
        HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Results.Unauthorized();
        }

        // Get attachment from database
        var attachment = await context.Attachments
            .FirstOrDefaultAsync(a => a.Id == id, cancellationToken);

        if (attachment == null)
        {
            return Results.NotFound(new { success = false, error = new { code = "FILE_NOT_FOUND", message = "File not found" } });
        }

        // Verify ownership
        if (attachment.UserId != userId)
        {
            return Results.Forbid();
        }

        // Delete from S3
        await s3Service.DeleteFileAsync(attachment.FileKey, cancellationToken);

        // Delete attachment record
        context.Attachments.Remove(attachment);
        await context.SaveChangesAsync(cancellationToken);

        return Results.Ok(new { success = true, message = "File deleted successfully" });
    }

    private static string GetMediaType(string extension)
    {
        var ext = extension.TrimStart('.').ToLowerInvariant();

        var imageExtensions = new[] { "jpg", "jpeg", "png", "gif", "webp", "bmp", "svg" };
        var videoExtensions = new[] { "mp4", "avi", "mov", "wmv", "flv", "webm", "mkv", "m4v" };
        var audioExtensions = new[] { "mp3", "wav", "ogg", "m4a", "aac", "flac", "wma", "webm" };

        if (imageExtensions.Contains(ext)) return "image";
        if (videoExtensions.Contains(ext)) return "video";
        if (audioExtensions.Contains(ext)) return "audio";
        return "document";
    }
}

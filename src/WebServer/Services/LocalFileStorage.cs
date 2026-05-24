using ECommerce.Application.Common.Interfaces;
using ECommerce.WebServer.Configuration;
using Microsoft.Extensions.Options;

namespace ECommerce.WebServer.Services;

public class LocalFileStorage : ILocalFileStorage
{
    private readonly string _webRootPath;
    private readonly FileStorageOptions _options;

    public LocalFileStorage(IWebHostEnvironment environment, IOptions<FileStorageOptions> options)
    {
        _webRootPath = environment.WebRootPath ?? Path.Combine(environment.ContentRootPath, "wwwroot");
        _options = options.Value;
    }

    public async Task<LocalFileUploadResult> SaveAsync(
        Stream fileStream,
        string fileName,
        string contentType,
        string folder,
        string? subFolder = null,
        CancellationToken cancellationToken = default)
    {
        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        if (!_options.AllowedImageExtensions.Contains(extension))
        {
            throw new InvalidOperationException($"File type '{extension}' is not allowed.");
        }

        var safeFolder = SanitizePathSegment(folder);
        var safeSubFolder = string.IsNullOrWhiteSpace(subFolder) ? null : SanitizePathSegment(subFolder);
        var storedName = $"{Guid.NewGuid():N}{extension}";

        var relativeParts = new List<string> { _options.UploadsPath.Trim('/'), safeFolder };
        if (safeSubFolder is not null)
        {
            relativeParts.Add(safeSubFolder);
        }

        var relativeDir = string.Join('/', relativeParts);
        var physicalDir = Path.Combine(_webRootPath, relativeDir.Replace('/', Path.DirectorySeparatorChar));
        Directory.CreateDirectory(physicalDir);

        var physicalPath = Path.Combine(physicalDir, storedName);
        await using (var output = File.Create(physicalPath))
        {
            await fileStream.CopyToAsync(output, cancellationToken);
        }

        var fileInfo = new FileInfo(physicalPath);
        var publicUrl = "/" + string.Join('/', relativeParts) + "/" + storedName;

        return new LocalFileUploadResult
        {
            Url = publicUrl,
            FileName = storedName,
            FileSize = fileInfo.Length
        };
    }

    public Task DeleteByUrlAsync(string url, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(url) || !url.StartsWith('/'))
        {
            return Task.CompletedTask;
        }

        var relativePath = url.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
        var physicalPath = Path.Combine(_webRootPath, relativePath);

        if (File.Exists(physicalPath))
        {
            File.Delete(physicalPath);
        }

        return Task.CompletedTask;
    }

    private static string SanitizePathSegment(string value)
    {
        var invalid = Path.GetInvalidFileNameChars();
        var cleaned = new string(value.Where(c => !invalid.Contains(c)).ToArray());
        return cleaned.Replace("..", string.Empty, StringComparison.Ordinal).Trim();
    }
}

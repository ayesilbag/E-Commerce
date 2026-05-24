namespace ECommerce.Application.Common.Interfaces;

public interface IS3Service
{
    /// <summary>
    /// Uploads a file to S3 and returns the file URL
    /// </summary>
    Task<FileUploadResult> UploadFileAsync(Stream fileStream, string fileName, string contentType, CancellationToken cancellationToken = default);

    /// <summary>
    /// Deletes a file from S3
    /// </summary>
    Task DeleteFileAsync(string fileKey, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a pre-signed URL for file download
    /// </summary>
    string GetFileUrl(string fileKey);
}

public class FileUploadResult
{
    public required string FileKey { get; set; }
    public required string FileUrl { get; set; }
    public long FileSize { get; set; }
}

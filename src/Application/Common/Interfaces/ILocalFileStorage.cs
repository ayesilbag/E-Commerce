namespace ECommerce.Application.Common.Interfaces;

public interface ILocalFileStorage
{
    Task<LocalFileUploadResult> SaveAsync(
        Stream fileStream,
        string fileName,
        string contentType,
        string folder,
        string? subFolder = null,
        CancellationToken cancellationToken = default);

    Task DeleteByUrlAsync(string url, CancellationToken cancellationToken = default);
}

public class LocalFileUploadResult
{
    public required string Url { get; set; }
    public required string FileName { get; set; }
    public long FileSize { get; set; }
}

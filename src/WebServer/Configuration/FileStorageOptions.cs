namespace ECommerce.WebServer.Configuration;

public class FileStorageOptions
{
    public const string SectionName = "FileStorage";

    /// <summary>Relative to wwwroot, e.g. "uploads"</summary>
    public string UploadsPath { get; set; } = "uploads";

    public long MaxFileSizeBytes { get; set; } = 10 * 1024 * 1024;

    public string[] AllowedImageExtensions { get; set; } = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
}

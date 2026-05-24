using Amazon.S3;
using Amazon.S3.Model;
using ECommerce.Application.Common.Interfaces;

namespace ECommerce.Infrastructure.Services;

public class S3Service : IS3Service
{
    private readonly IAmazonS3 _s3Client;
    private readonly string _bucketName;

    public S3Service(IAmazonS3 s3Client, IConfiguration configuration)
    {
        _s3Client = s3Client;
        _bucketName = configuration["S3Settings:BucketName"] ?? throw new ArgumentNullException("S3Settings:BucketName");
    }

    public async Task<FileUploadResult> UploadFileAsync(Stream fileStream, string fileName, string contentType, CancellationToken cancellationToken = default)
    {
        var key = $"{Guid.NewGuid()}/{fileName}";

        var putRequest = new PutObjectRequest
        {
            BucketName = _bucketName,
            Key = key,
            InputStream = fileStream,
            ContentType = contentType
        };

        await _s3Client.PutObjectAsync(putRequest, cancellationToken);

        return new FileUploadResult
        {
            FileKey = key,
            FileUrl = $"https://{_bucketName}.s3.amazonaws.com/{key}",
            FileSize = fileStream.Length
        };
    }

    public async Task DeleteFileAsync(string fileKey, CancellationToken cancellationToken = default)
    {
        var deleteRequest = new DeleteObjectRequest
        {
            BucketName = _bucketName,
            Key = fileKey
        };

        await _s3Client.DeleteObjectAsync(deleteRequest, cancellationToken);
    }

    public string GetFileUrl(string fileKey)
    {
        return $"https://{_bucketName}.s3.amazonaws.com/{fileKey}";
    }
}

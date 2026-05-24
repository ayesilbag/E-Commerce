namespace ECommerce.Infrastructure.Configuration;

public class S3Options
{
    public string BucketName { get; set; } = string.Empty;
    public string Region { get; set; } = "eu-central-1";
}

namespace ECommerce.Infrastructure.Email;

public sealed record EmailTemplateModel
{
    public required string Preheader { get; init; }
    public required string Heading { get; init; }
    public required string Intro { get; init; }
    public required string BodyHtml { get; init; }
    public string? GreetingName { get; init; }
    public string BrandName { get; init; } = "Digitalep";
    public string BrandTag { get; init; } = "E-Commerce";
    public string BrandInitial { get; init; } = "D";
}

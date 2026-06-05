namespace ECommerce.Application.Settings.DTOs;

public class SiteSeoDto
{
    public string? DefaultTitle { get; set; }
    public string? DefaultDescription { get; set; }
    public string? DefaultKeywords { get; set; }
    public string? OgImageUrl { get; set; }
    public string? TwitterHandle { get; set; }
    public IReadOnlyList<PageSeoDto> Pages { get; set; } = [];
}

public class PageSeoDto
{
    public string PageKey { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string Path { get; set; } = string.Empty;
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Keywords { get; set; }
    public string? OgImageUrl { get; set; }
}

public class PageSeoInputDto
{
    public string PageKey { get; set; } = string.Empty;
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Keywords { get; set; }
    public string? OgImageUrl { get; set; }
}

namespace ECommerce.Application.Products.DTOs;

public class ReviewDto
{
    public required string Id { get; set; }
    public required string ProductId { get; set; }
    public required string UserId { get; set; }
    public required string UserName { get; set; }
    public int Rating { get; set; }
    public required string Title { get; set; }
    public required string Comment { get; set; }
    public string[]? Images { get; set; }
    public int Helpful { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateReviewRequest
{
    public int Rating { get; set; }
    public required string Title { get; set; }
    public required string Comment { get; set; }
    public string[]? Images { get; set; }
}

public class ReviewListResponse
{
    public required ReviewDto[] Reviews { get; set; }
    public required PaginationDto Pagination { get; set; }
}

namespace ECommerce.Domain.Common;

public abstract class BaseTenantedEntity : BaseEntity
{
    public string? TenantCode { get; set; }
    public string? TenantHost { get; set; }
}

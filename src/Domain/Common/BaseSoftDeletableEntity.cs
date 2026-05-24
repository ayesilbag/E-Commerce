using System;

namespace ECommerce.Domain.Common;

public abstract class BaseSoftDeletableEntity : BaseAuditableEntity
{
    public bool IsDeleted { get; set; } = false;
} 

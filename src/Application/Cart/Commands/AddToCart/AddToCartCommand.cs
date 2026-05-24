using DomainCart = ECommerce.Domain.Entities.Cart;
using ECommerce.Application.Cart.DTOs;

namespace ECommerce.Application.Cart.Commands.AddToCart;

public record AddToCartCommand(AddToCartRequest Request) : IRequest<CartDto>;

public class AddToCartCommandHandler : IRequestHandler<AddToCartCommand, CartDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IUser _currentUser;

    public AddToCartCommandHandler(IApplicationDbContext context, IUser currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<CartDto> Handle(AddToCartCommand command, CancellationToken cancellationToken)
    {
        var userId = _currentUser.Id;

        // Get or create cart
        var cart = await _context.Carts
            .Include(x => x.Items)
            .FirstOrDefaultAsync(x => x.UserId == userId, cancellationToken);

        if (cart is null)
        {
            cart = new DomainCart
            {
                UserId = userId,
                Items = new List<CartItem>()
            };
            _context.Carts.Add(cart);
        }

        // Check if product exists
        var product = await _context.Products.FindAsync(new object[] { command.Request.ProductId }, cancellationToken);
        if (product is null)
            throw new NotFoundException(nameof(Product), command.Request.ProductId);

        // Check if item already exists in cart
        var existingItem = cart.Items.FirstOrDefault(x => x.ProductId == command.Request.ProductId);
        if (existingItem is not null)
        {
            existingItem.Quantity += command.Request.Quantity;
        }
        else
        {
            var cartItem = new CartItem
            {
                CartId = cart.Id,
                ProductId = command.Request.ProductId,
                Product = product,
                Quantity = command.Request.Quantity,
                VariantColor = command.Request.Variant?.Color,
                VariantSize = command.Request.Variant?.Size,
                VariantFit = command.Request.Variant?.Fit,
                VariantSleeveType = command.Request.Variant?.SleeveType,
                VariantNeckType = command.Request.Variant?.NeckType,
                VariantMaterial = command.Request.Variant?.Material,
                VariantSeason = command.Request.Variant?.Season
            };
            cart.Items.Add(cartItem);
        }

        // Update cart totals
        UpdateCartTotals(cart);

        await _context.SaveChangesAsync(cancellationToken);

        return MapToCartDto(cart);
    }

    private void UpdateCartTotals(DomainCart cart)
    {
        cart.Subtotal = cart.Items.Sum(x => x.Product!.Price * x.Quantity);
        cart.Tax = cart.Subtotal * 0.18m; // 18% VAT
        cart.Total = cart.Subtotal + cart.Tax + (cart.ShippingCost ?? 0) - cart.DiscountAmount;
        cart.ItemCount = cart.Items.Sum(x => x.Quantity);
    }

    private CartDto MapToCartDto(DomainCart cart)
    {
        return new CartDto
        {
            Items = cart.Items.Select(item => new CartItemDto
            {
                ProductId = item.ProductId,
                ProductName = item.Product!.Name,
                ProductImage = item.Product.Image,
                Quantity = item.Quantity,
                Price = item.Product.Price,
                Subtotal = item.Product.Price * item.Quantity,
                SelectedVariant = item.VariantColor != null || item.VariantSize != null ? new CartItemVariantDto
                {
                    Color = item.VariantColor,
                    Size = item.VariantSize,
                    Fit = item.VariantFit,
                    SleeveType = item.VariantSleeveType,
                    NeckType = item.VariantNeckType,
                    Material = item.VariantMaterial,
                    Season = item.VariantSeason
                } : null
            }).ToArray(),
            Subtotal = cart.Subtotal,
            Tax = cart.Tax,
            ShippingCost = cart.ShippingCost,
            DiscountAmount = cart.DiscountAmount,
            DiscountCode = cart.DiscountCode,
            Total = cart.Total,
            ItemCount = cart.ItemCount
        };
    }
}

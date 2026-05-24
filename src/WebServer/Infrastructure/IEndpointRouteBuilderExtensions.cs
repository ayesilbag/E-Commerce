using System.Diagnostics.CodeAnalysis;

namespace ECommerce.WebServer.Infrastructure;

public static class IEndpointRouteBuilderExtensions
{
    public static IEndpointRouteBuilder MapGet(this IEndpointRouteBuilder builder, Delegate handler, [StringSyntax("Route")] string pattern = "", bool requireAuthorization = false)
    {
        Guard.Against.AnonymousMethod(handler);

        var routeBuilder = builder.MapGet(pattern, handler)
                  .WithName(handler.Method.Name);

        if (requireAuthorization)
        {
            routeBuilder.RequireAuthorization();
        }

        return builder;
    }

    public static IEndpointRouteBuilder MapPost(this IEndpointRouteBuilder builder, Delegate handler, [StringSyntax("Route")] string pattern = "", bool requireAuthorization = false, bool requireRateLimiting = false)
    {
        Guard.Against.AnonymousMethod(handler);

        var routeBuilder = builder.MapPost(pattern, handler)
            .WithName(handler.Method.Name);

        if (requireAuthorization)
        {
            routeBuilder.RequireAuthorization();
        }
        if (requireRateLimiting)
        {
            routeBuilder.RequireRateLimiting("fixed");
        }

        return builder;
    }

    public static IEndpointRouteBuilder MapPut(this IEndpointRouteBuilder builder, Delegate handler, [StringSyntax("Route")] string pattern, bool requireAuthorization = false)
    {
        Guard.Against.AnonymousMethod(handler);

        var routeBuilder = builder.MapPut(pattern, handler)
            .WithName(handler.Method.Name);

        if (requireAuthorization)
        {
            routeBuilder.RequireAuthorization();
        }

        return builder;
    }

    public static IEndpointRouteBuilder MapDelete(this IEndpointRouteBuilder builder, Delegate handler, [StringSyntax("Route")] string pattern, bool requireAuthorization = false)
    {
        Guard.Against.AnonymousMethod(handler);

        var routeBuilder = builder.MapDelete(pattern, handler)
            .WithName(handler.Method.Name);

        if (requireAuthorization)
        {
            routeBuilder.RequireAuthorization();
        }

        return builder;
    }

    public static IEndpointRouteBuilder MapPatch(this IEndpointRouteBuilder builder, Delegate handler, [StringSyntax("Route")] string pattern, bool requireAuthorization = false)
    {
        Guard.Against.AnonymousMethod(handler);

        var routeBuilder = builder.MapPatch(pattern, handler)
            .WithName(handler.Method.Name);

        if (requireAuthorization)
        {
            routeBuilder.RequireAuthorization();
        }

        return builder;
    }
}

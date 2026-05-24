using Microsoft.AspNetCore.Mvc;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Infrastructure.Configuration;
using ECommerce.Infrastructure.Data;
using ECommerce.WebServer.Configuration;
using ECommerce.WebServer.Services;
using NSwag;
using NSwag.Generation.Processors.Security;

namespace ECommerce.WebServer;

public static class DependencyInjection
{
    public static IServiceCollection AddWebServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<ApiOptions>(configuration.GetSection("ApiSettings"));

        services.AddDatabaseDeveloperPageExceptionFilter();

        services.AddScoped<IUser, CurrentUser>();
        services.AddScoped<ITenant, CurrentTenant>();

        services.AddHttpContextAccessor();

        services.Configure<FileStorageOptions>(configuration.GetSection(FileStorageOptions.SectionName));
        services.AddScoped<ILocalFileStorage, LocalFileStorage>();
        services.AddScoped<ProductExcelService>();

        services.AddHealthChecks()
            .AddDbContextCheck<ApplicationDbContext>();

        services.AddExceptionHandler<CustomExceptionHandler>();
        services.AddProblemDetails();

        // Customise default API behaviour
        services.Configure<ApiBehaviorOptions>(options =>
            options.SuppressModelStateInvalidFilter = true);

        services.AddEndpointsApiExplorer();

        services.AddOpenApiDocument((configure, sp) =>
        {
            configure.Title = "ECommerce API";

            // Add JWT
            configure.AddSecurity("JWT", Enumerable.Empty<string>(), new OpenApiSecurityScheme
            {
                Type = OpenApiSecuritySchemeType.ApiKey,
                Name = "Authorization",
                In = OpenApiSecurityApiKeyLocation.Header,
                Description = "Type into the textbox: Bearer {your JWT token}."
            });

            configure.OperationProcessors.Add(new AspNetCoreOperationSecurityScopeProcessor("JWT"));
        });

        return services;
    }
}

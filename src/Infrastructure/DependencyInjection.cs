using System.Text;
using Amazon.BedrockRuntime;
using Amazon.S3;
using Amazon.SimpleEmail;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using ECommerce.Application.Common.Configuration;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Domain.Constants;
using ECommerce.Infrastructure.Configuration;
using ECommerce.Infrastructure.Data;
using ECommerce.Infrastructure.Email;
using ECommerce.Infrastructure.Data.Interceptors;
using ECommerce.Infrastructure.Identity;
using ECommerce.Infrastructure.Services;

namespace ECommerce.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<ApiOptions>(configuration.GetSection("ApiSettings"));

        var connectionString = configuration.GetConnectionString("DefaultConnection");

        Guard.Against.Null(connectionString, message: "Connection string 'DefaultConnection' not found.");

        services.AddScoped<ISaveChangesInterceptor, AuditableEntityInterceptor>();
        services.AddScoped<ISaveChangesInterceptor, DispatchDomainEventsInterceptor>();

        services.AddDbContext<ApplicationDbContext>((sp, options) =>
        {
            options.AddInterceptors(sp.GetServices<ISaveChangesInterceptor>());
            options.UseSqlServer(connectionString, sqlServerOptions =>
            {
                sqlServerOptions.CommandTimeout(300);
                sqlServerOptions.EnableRetryOnFailure(3);
                sqlServerOptions.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
            });
        });

        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

        services.AddScoped<ApplicationDbContextInitialiser>();

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options => 
            {
                var apiOptions = configuration.GetSection("ApiSettings").Get<ApiOptions>();
                Guard.Against.NullOrWhiteSpace(apiOptions?.SecretKey, message: "ApiSettings:SecretKey not found in configuration.");
                
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(apiOptions.SecretKey)),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });
        services.AddAuthorizationBuilder();

        services
            .AddIdentityCore<ApplicationUser>()
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddApiEndpoints();

        services.AddSingleton(TimeProvider.System);
        services.AddTransient<IIdentityService, IdentityService>();

        services.AddAuthorizationBuilder()
           .AddPolicy(Policies.CanPurge, policy => policy.RequireRole(Roles.Administrator));

        services.AddDefaultAWSOptions(configuration.GetAWSOptions());

        services.AddAWSService<IAmazonSimpleEmailService>();
        services.AddSingleton<ISESService, SESService>();

        services.AddAWSService<IAmazonBedrockRuntime>();

        services.AddFluentEmail(configuration);
        services.AddSingleton<EmailTemplateRenderer>();
        services.AddTransient<IEmailSender<ApplicationUser>, FluentEmailSender>();

        services.Configure<RateLimitSettings>(configuration.GetSection("RateLimitSettings"));

        services.AddSingleton<IRateLimitService, RateLimitService>();

        // S3 Service
        services.Configure<S3Options>(configuration.GetSection("S3Settings"));
        services.AddAWSService<IAmazonS3>();
        services.AddScoped<IS3Service, S3Service>();

        return services;
    }

    public static void AddFluentEmail(this IServiceCollection services,
         IConfiguration configuration)
    {
        var smtpSettings = configuration.GetSection("SMTPSettings");

        var defaultFromEmail = smtpSettings["DefaultFromEmail"];
        var defaultFromName = smtpSettings["DefaultFromName"];
        var host = smtpSettings["Host"];
        var port = smtpSettings.GetValue<int>("Port");
        var username = smtpSettings["Username"];
        var password = smtpSettings["Password"];

        services.AddFluentEmail(defaultFromEmail, defaultFromName)
            .AddSmtpSender(host, port, username, password);
    }
}

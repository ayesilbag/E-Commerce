using System.Threading.RateLimiting;
using ECommerce.Infrastructure;
using ECommerce.Infrastructure.Configuration;
using ECommerce.Infrastructure.Data;
using ECommerce.Infrastructure.Identity;
using ECommerce.WebServer;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddWebServices(builder.Configuration);

// Configure CORS
var corsOptions = builder.Configuration.GetSection("CorsSettings").Get<CorsOptions>();
builder.Services.AddCors(options => options.AddDefaultPolicy(policy => policy.WithOrigins(corsOptions?.AllowedOrigins ?? [])
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()));

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    options.AddPolicy("fixed", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString(),
            factory: partition => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 10,
                Window = TimeSpan.FromSeconds(10)
            }));
});

builder.Services.AddAntiforgery();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    await app.InitialiseDatabaseAsync();
}
else
{
    app.UseExceptionHandler();
    // The default HSTS value is 30 days. See https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHealthChecks("/health");
app.UseHttpsRedirection();

var webRoot = app.Environment.WebRootPath ?? Path.Combine(app.Environment.ContentRootPath, "wwwroot");
Directory.CreateDirectory(Path.Combine(webRoot, "uploads"));
Directory.CreateDirectory(Path.Combine(webRoot, "admin"));

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.UseRateLimiter();

app.UseAntiforgery();

app.UseOpenApi();
app.UseSwaggerUi();

app.MapIdentityApi<ApplicationUser>();

app.MapEndpoints();
app.MapGroup("/api").WithTags("Health").MapGet("/health", () => Results.Ok(new { timestamp = DateTime.UtcNow, status = "healthy" })).WithName("Health");

app.MapFallbackToFile("/admin/{*path:nonfile}", "admin/index.html");

await app.EnsureSiteSettingsSeededAsync();

app.Run();

public partial class Program { }

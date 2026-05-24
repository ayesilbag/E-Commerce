using FluentAssertions;
using ECommerce.Infrastructure.Services;

namespace ECommerce.Infrastructure.IntegrationTests;

public class RateLimitServiceTests
{
    // [Test]
    // public async Task IsAllowedAsync_ShouldAllowRequestsWithinUserLimit()
    // {
    //     var service = new RateLimitService();
    //     const string userId = "user1";

    //     for (int i = 0; i < 10; i++)
    //     {
    //         var result = await service.IsAllowedAsync(userId);
    //         result.Should().BeTrue($"Request {i + 1} should be allowed");
    //     }
    // }

    // [Test]
    // public async Task IsAllowedAsync_ShouldRejectRequestsExceedingUserLimit()
    // {
    //     var service = new RateLimitService();
    //     const string userId = "user1";

    //     for (int i = 0; i < 10; i++)
    //     {
    //         await service.IsAllowedAsync(userId);
    //     }

    //     var result = await service.IsAllowedAsync(userId);
    //     result.Should().BeFalse("11th request should be rejected due to per-user limit");
    // }

    // [Test]
    // public async Task IsAllowedAsync_ShouldAllowRequestsAfterUserTimeWindowReset()
    // {
    //     var service = new RateLimitService();
    //     const string userId = "user1";

    //     for (int i = 0; i < 10; i++)
    //     {
    //         await service.IsAllowedAsync(userId);
    //     }

    //     var rejectedResult = await service.IsAllowedAsync(userId);
    //     rejectedResult.Should().BeFalse();

    //     await Task.Delay(TimeSpan.FromMinutes(1).Add(TimeSpan.FromMilliseconds(100)));

    //     var allowedResult = await service.IsAllowedAsync(userId);
    //     allowedResult.Should().BeTrue("Request should be allowed after time window reset");
    // }

    // [Test]
    // public async Task IsAllowedAsync_ShouldTrackDifferentUsersIndependently()
    // {
    //     var service = new RateLimitService();

    //     for (int i = 0; i < 10; i++)
    //     {
    //         var user1Result = await service.IsAllowedAsync("user1");
    //         user1Result.Should().BeTrue($"User1 request {i + 1} should be allowed");

    //         var user2Result = await service.IsAllowedAsync("user2");
    //         user2Result.Should().BeTrue($"User2 request {i + 1} should be allowed");
    //     }

    //     var user1ExceededResult = await service.IsAllowedAsync("user1");
    //     user1ExceededResult.Should().BeFalse("User1 should be rate limited");

    //     var user2ExceededResult = await service.IsAllowedAsync("user2");
    //     user2ExceededResult.Should().BeFalse("User2 should be rate limited");
    // }

    // [Test]
    // public async Task IsAllowedAsync_ShouldEnforceGlobalHourlyLimit()
    // {
    //     var service = new RateLimitService();

    //     for (int userId = 1; userId <= 10; userId++)
    //     {
    //         for (int request = 0; request < 10; request++)
    //         {
    //             var result = await service.IsAllowedAsync($"user{userId}");
    //             result.Should().BeTrue($"Request {request + 1} for user{userId} should be allowed");
    //         }
    //     }

    //     var exceededResult = await service.IsAllowedAsync("user11");
    //     exceededResult.Should().BeFalse("Request should be rejected due to global hourly limit");
    // }

    // [Test]
    // public async Task IsAllowedAsync_ShouldEnforceGlobalDailyLimit()
    // {
    //     var service = new RateLimitService();

    //     for (int i = 0; i < 1000; i++)
    //     {
    //         var result = await service.IsAllowedAsync($"user{i % 100}");
    //         result.Should().BeTrue($"Request {i + 1} should be allowed");
    //     }

    //     var exceededResult = await service.IsAllowedAsync("userExtra");
    //     exceededResult.Should().BeFalse("Request should be rejected due to global daily limit");
    // }

    // [Test]
    // public async Task IsAllowedAsync_ShouldPrioritizeGlobalLimitsOverUserLimits()
    // {
    //     var service = new RateLimitService();

    //     for (int i = 0; i < 100; i++)
    //     {
    //         await service.IsAllowedAsync($"user{i}");
    //     }

    //     var result = await service.IsAllowedAsync("newUser");
    //     result.Should().BeFalse("Request should be rejected due to global hourly limit even for new user");
    // }
}
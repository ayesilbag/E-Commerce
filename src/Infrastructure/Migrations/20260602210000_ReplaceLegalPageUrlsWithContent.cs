using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerce.Infrastructure.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20260602210000_ReplaceLegalPageUrlsWithContent")]
    public partial class ReplaceLegalPageUrlsWithContent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HasSsl",
                table: "SiteSettings");

            migrationBuilder.DropColumn(
                name: "AboutPageUrl",
                table: "SiteSettings");

            migrationBuilder.DropColumn(
                name: "DeliveryReturnsPageUrl",
                table: "SiteSettings");

            migrationBuilder.DropColumn(
                name: "PrivacyPolicyPageUrl",
                table: "SiteSettings");

            migrationBuilder.DropColumn(
                name: "DistanceSellingAgreementPageUrl",
                table: "SiteSettings");

            migrationBuilder.AddColumn<string>(
                name: "AboutPageContent",
                table: "SiteSettings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeliveryReturnsPageContent",
                table: "SiteSettings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PrivacyPolicyPageContent",
                table: "SiteSettings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DistanceSellingAgreementPageContent",
                table: "SiteSettings",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AboutPageContent",
                table: "SiteSettings");

            migrationBuilder.DropColumn(
                name: "DeliveryReturnsPageContent",
                table: "SiteSettings");

            migrationBuilder.DropColumn(
                name: "PrivacyPolicyPageContent",
                table: "SiteSettings");

            migrationBuilder.DropColumn(
                name: "DistanceSellingAgreementPageContent",
                table: "SiteSettings");

            migrationBuilder.AddColumn<string>(
                name: "AboutPageUrl",
                table: "SiteSettings",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeliveryReturnsPageUrl",
                table: "SiteSettings",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PrivacyPolicyPageUrl",
                table: "SiteSettings",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DistanceSellingAgreementPageUrl",
                table: "SiteSettings",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "HasSsl",
                table: "SiteSettings",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}

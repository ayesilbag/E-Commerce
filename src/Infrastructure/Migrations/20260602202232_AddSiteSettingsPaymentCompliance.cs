using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerce.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSiteSettingsPaymentCompliance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.AddColumn<string>(
                name: "IyzicoPayLogoUrl",
                table: "SiteSettings",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MastercardLogoUrl",
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
                name: "VisaLogoUrl",
                table: "SiteSettings",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AboutPageUrl",
                table: "SiteSettings");

            migrationBuilder.DropColumn(
                name: "DeliveryReturnsPageUrl",
                table: "SiteSettings");

            migrationBuilder.DropColumn(
                name: "DistanceSellingAgreementPageUrl",
                table: "SiteSettings");

            migrationBuilder.DropColumn(
                name: "HasSsl",
                table: "SiteSettings");

            migrationBuilder.DropColumn(
                name: "IyzicoPayLogoUrl",
                table: "SiteSettings");

            migrationBuilder.DropColumn(
                name: "MastercardLogoUrl",
                table: "SiteSettings");

            migrationBuilder.DropColumn(
                name: "PrivacyPolicyPageUrl",
                table: "SiteSettings");

            migrationBuilder.DropColumn(
                name: "VisaLogoUrl",
                table: "SiteSettings");
        }
    }
}

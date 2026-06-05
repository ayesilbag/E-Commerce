using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerce.Infrastructure.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20260606140000_AddSiteSettingsLegalPageTitles")]
    public partial class AddSiteSettingsLegalPageTitles : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(name: "AboutPageTitle", table: "SiteSettings", type: "nvarchar(200)", maxLength: 200, nullable: true);
            migrationBuilder.AddColumn<string>(name: "DeliveryReturnsPageTitle", table: "SiteSettings", type: "nvarchar(200)", maxLength: 200, nullable: true);
            migrationBuilder.AddColumn<string>(name: "PrivacyPolicyPageTitle", table: "SiteSettings", type: "nvarchar(200)", maxLength: 200, nullable: true);
            migrationBuilder.AddColumn<string>(name: "DistanceSellingAgreementPageTitle", table: "SiteSettings", type: "nvarchar(200)", maxLength: 200, nullable: true);
            migrationBuilder.AddColumn<string>(name: "PreInformationFormPageTitle", table: "SiteSettings", type: "nvarchar(200)", maxLength: 200, nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "AboutPageTitle", table: "SiteSettings");
            migrationBuilder.DropColumn(name: "DeliveryReturnsPageTitle", table: "SiteSettings");
            migrationBuilder.DropColumn(name: "PrivacyPolicyPageTitle", table: "SiteSettings");
            migrationBuilder.DropColumn(name: "DistanceSellingAgreementPageTitle", table: "SiteSettings");
            migrationBuilder.DropColumn(name: "PreInformationFormPageTitle", table: "SiteSettings");
        }
    }
}

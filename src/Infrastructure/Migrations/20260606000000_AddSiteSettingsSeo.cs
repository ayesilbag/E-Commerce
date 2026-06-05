using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerce.Infrastructure.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20260606000000_AddSiteSettingsSeo")]
    public partial class AddSiteSettingsSeo : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PageSeoJson",
                table: "SiteSettings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SeoDefaultDescription",
                table: "SiteSettings",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SeoDefaultKeywords",
                table: "SiteSettings",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SeoDefaultTitle",
                table: "SiteSettings",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SeoOgImageUrl",
                table: "SiteSettings",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SeoTwitterHandle",
                table: "SiteSettings",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "PageSeoJson", table: "SiteSettings");
            migrationBuilder.DropColumn(name: "SeoDefaultDescription", table: "SiteSettings");
            migrationBuilder.DropColumn(name: "SeoDefaultKeywords", table: "SiteSettings");
            migrationBuilder.DropColumn(name: "SeoDefaultTitle", table: "SiteSettings");
            migrationBuilder.DropColumn(name: "SeoOgImageUrl", table: "SiteSettings");
            migrationBuilder.DropColumn(name: "SeoTwitterHandle", table: "SiteSettings");
        }
    }
}

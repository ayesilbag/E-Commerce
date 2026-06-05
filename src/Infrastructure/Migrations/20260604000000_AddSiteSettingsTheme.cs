using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerce.Infrastructure.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20260604000000_AddSiteSettingsTheme")]
    public partial class AddSiteSettingsTheme : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ThemeFontFamily",
                table: "SiteSettings",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ThemePrimaryDark",
                table: "SiteSettings",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ThemePrimaryLight",
                table: "SiteSettings",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "ThemeFontFamily", table: "SiteSettings");
            migrationBuilder.DropColumn(name: "ThemePrimaryDark", table: "SiteSettings");
            migrationBuilder.DropColumn(name: "ThemePrimaryLight", table: "SiteSettings");
        }
    }
}

using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerce.Infrastructure.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20260602220000_AddPreInformationFormRemoveCardLogos")]
    public partial class AddPreInformationFormRemoveCardLogos : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MastercardLogoUrl",
                table: "SiteSettings");

            migrationBuilder.DropColumn(
                name: "VisaLogoUrl",
                table: "SiteSettings");

            migrationBuilder.AddColumn<string>(
                name: "PreInformationFormPageContent",
                table: "SiteSettings",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PreInformationFormPageContent",
                table: "SiteSettings");

            migrationBuilder.AddColumn<string>(
                name: "MastercardLogoUrl",
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
    }
}

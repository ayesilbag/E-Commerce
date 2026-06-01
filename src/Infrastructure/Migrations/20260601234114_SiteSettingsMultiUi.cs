using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerce.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SiteSettingsMultiUi : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Code",
                table: "SiteSettings",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "SiteSettings",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDefault",
                table: "SiteSettings",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "SiteSettings",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.Sql("""
                UPDATE SiteSettings
                SET Code = CASE WHEN Id = 'global' THEN 'default' ELSE CONCAT('ui-', LEFT(REPLACE(CAST(Id AS nvarchar(36)), '-', ''), 8)) END,
                    Name = COALESCE(NULLIF(SiteName, ''), 'Varsayılan UI'),
                    IsActive = 1,
                    IsDefault = CASE WHEN Id = 'global' THEN 1 ELSE 0 END
                WHERE Code IS NULL
                """);

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "SiteSettings",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "SiteSettings",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200,
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SiteSettings_Code",
                table: "SiteSettings",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SiteSettings_IsActive_IsDefault",
                table: "SiteSettings",
                columns: new[] { "IsActive", "IsDefault" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_SiteSettings_Code",
                table: "SiteSettings");

            migrationBuilder.DropIndex(
                name: "IX_SiteSettings_IsActive_IsDefault",
                table: "SiteSettings");

            migrationBuilder.DropColumn(
                name: "Code",
                table: "SiteSettings");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "SiteSettings");

            migrationBuilder.DropColumn(
                name: "IsDefault",
                table: "SiteSettings");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "SiteSettings");
        }
    }
}

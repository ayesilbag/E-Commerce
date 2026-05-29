using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerce.Infrastructure.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20260529150000_RemoveDuplicateUserFields")]
    public partial class RemoveDuplicateUserFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                UPDATE [Users]
                SET [PhoneNumber] = [Phone]
                WHERE [Phone] IS NOT NULL
                  AND ([PhoneNumber] IS NULL OR [PhoneNumber] = N'');
                """);

            migrationBuilder.Sql(
                """
                INSERT INTO [UserRoles] ([UserId], [RoleId])
                SELECT u.[Id], r.[Id]
                FROM [Users] u
                CROSS JOIN [Roles] r
                WHERE u.[Role] = 1
                  AND r.[Name] = N'Administrator'
                  AND NOT EXISTS (
                      SELECT 1
                      FROM [UserRoles] ur
                      WHERE ur.[UserId] = u.[Id] AND ur.[RoleId] = r.[Id]);
                """);

            migrationBuilder.DropColumn(name: "Phone", table: "Users");
            migrationBuilder.DropColumn(name: "Role", table: "Users");

            migrationBuilder.AlterColumn<string>(
                name: "PhoneNumber",
                table: "Users",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "PhoneNumber",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "Users",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Role",
                table: "Users",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.Sql(
                """
                UPDATE [Users]
                SET [Phone] = [PhoneNumber];
                """);

            migrationBuilder.Sql(
                """
                UPDATE u
                SET u.[Role] = 1
                FROM [Users] u
                INNER JOIN [UserRoles] ur ON ur.[UserId] = u.[Id]
                INNER JOIN [Roles] r ON r.[Id] = ur.[RoleId]
                WHERE r.[Name] = N'Administrator';
                """);
        }
    }
}

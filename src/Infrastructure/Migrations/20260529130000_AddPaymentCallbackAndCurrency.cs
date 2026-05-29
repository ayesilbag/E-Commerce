using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerce.Infrastructure.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20260529130000_AddPaymentCallbackAndCurrency")]
    public partial class AddPaymentCallbackAndCurrency : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CallbackBaseUrl",
                table: "PaymentClients",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Currency",
                table: "PaymentClients",
                type: "nvarchar(3)",
                maxLength: 3,
                nullable: false,
                defaultValue: "TRY");

            migrationBuilder.CreateTable(
                name: "PaymentSettings",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CallbackBaseUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    DefaultCurrency = table.Column<string>(type: "nvarchar(3)", maxLength: 3, nullable: false, defaultValue: "TRY")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaymentSettings", x => x.Id);
                });

            migrationBuilder.Sql(
                """
                IF NOT EXISTS (SELECT 1 FROM [PaymentSettings] WHERE [Id] = N'global')
                INSERT INTO [PaymentSettings] ([Id], [CallbackBaseUrl], [DefaultCurrency])
                VALUES (N'global', NULL, N'TRY');
                """);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "PaymentSettings");

            migrationBuilder.DropColumn(name: "CallbackBaseUrl", table: "PaymentClients");
            migrationBuilder.DropColumn(name: "Currency", table: "PaymentClients");
        }
    }
}

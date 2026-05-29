using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerce.Infrastructure.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20260529120000_AddPaymentClients")]
    public partial class AddPaymentClients : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PaymentClients",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    TenantCode = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    ApiKey = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    SecretKey = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    IsSandbox = table.Column<bool>(type: "bit", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    IsDefault = table.Column<bool>(type: "bit", nullable: false),
                    Locale = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: false),
                    EnabledInstallments = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    SuccessRedirectUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    FailureRedirectUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaymentClients", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PaymentSessions",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    OrderId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    PaymentClientId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ConversationId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Token = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    IyzicoPaymentId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    IyzicoPaymentStatus = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    ErrorMessage = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PaidPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Currency = table.Column<string>(type: "nvarchar(3)", maxLength: 3, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaymentSessions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PaymentSessions_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PaymentSessions_PaymentClients_PaymentClientId",
                        column: x => x.PaymentClientId,
                        principalTable: "PaymentClients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PaymentClients_Code",
                table: "PaymentClients",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PaymentClients_IsActive_TenantCode",
                table: "PaymentClients",
                columns: new[] { "IsActive", "TenantCode" });

            migrationBuilder.CreateIndex(
                name: "IX_PaymentSessions_OrderId",
                table: "PaymentSessions",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_PaymentSessions_PaymentClientId",
                table: "PaymentSessions",
                column: "PaymentClientId");

            migrationBuilder.CreateIndex(
                name: "IX_PaymentSessions_Token",
                table: "PaymentSessions",
                column: "Token",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "PaymentSessions");
            migrationBuilder.DropTable(name: "PaymentClients");
        }
    }
}

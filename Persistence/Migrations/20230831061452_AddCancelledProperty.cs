using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddCancelledProperty : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Activities_AspNetUsers_AppUserId",
                table: "Activities");

            migrationBuilder.DropIndex(
                name: "IX_Activities_AppUserId",
                table: "Activities");

            migrationBuilder.RenameColumn(
                name: "AppUserId",
                table: "Activities",
                newName: "HostUsername");

            migrationBuilder.AddColumn<bool>(
                name: "isCancelled",
                table: "Activities",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "isCancelled",
                table: "Activities");

            migrationBuilder.RenameColumn(
                name: "HostUsername",
                table: "Activities",
                newName: "AppUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Activities_AppUserId",
                table: "Activities",
                column: "AppUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Activities_AspNetUsers_AppUserId",
                table: "Activities",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}

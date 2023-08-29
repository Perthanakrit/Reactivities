using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ActivityAttendee : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AppUserId",
                table: "Activities",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ActivityAttendees",
                columns: table => new
                {
                    AppUserId = table.Column<string>(type: "TEXT", nullable: false),
                    ActivityId = table.Column<Guid>(type: "TEXT", nullable: false),
                    IsHost = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActivityAttendees", x => new { x.AppUserId, x.ActivityId });
                    table.ForeignKey(
                        name: "FK_ActivityAttendees_Activities_ActivityId",
                        column: x => x.ActivityId,
                        principalTable: "Activities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ActivityAttendees_AspNetUsers_AppUserId",
                        column: x => x.AppUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Activities_AppUserId",
                table: "Activities",
                column: "AppUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ActivityAttendees_ActivityId",
                table: "ActivityAttendees",
                column: "ActivityId");

            migrationBuilder.AddForeignKey(
                name: "FK_Activities_AspNetUsers_AppUserId",
                table: "Activities",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Activities_AspNetUsers_AppUserId",
                table: "Activities");

            migrationBuilder.DropTable(
                name: "ActivityAttendees");

            migrationBuilder.DropIndex(
                name: "IX_Activities_AppUserId",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "Activities");
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace WatchVideoApi.Migrations
{
    /// <inheritdoc />
    public partial class ChangedNames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_User_Chat_ChatId",
                table: "User");

            migrationBuilder.DropTable(
                name: "Chat");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Videos",
                table: "Videos");

            migrationBuilder.RenameTable(
                name: "Videos",
                newName: "Video");

            migrationBuilder.RenameColumn(
                name: "ChatId",
                table: "User",
                newName: "ChatRoomId");

            migrationBuilder.RenameIndex(
                name: "IX_User_ChatId",
                table: "User",
                newName: "IX_User_ChatRoomId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Video",
                table: "Video",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "ChatRoom",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UrlEndPoint = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatRoom", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_User_ChatRoom_ChatRoomId",
                table: "User",
                column: "ChatRoomId",
                principalTable: "ChatRoom",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_User_ChatRoom_ChatRoomId",
                table: "User");

            migrationBuilder.DropTable(
                name: "ChatRoom");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Video",
                table: "Video");

            migrationBuilder.RenameTable(
                name: "Video",
                newName: "Videos");

            migrationBuilder.RenameColumn(
                name: "ChatRoomId",
                table: "User",
                newName: "ChatId");

            migrationBuilder.RenameIndex(
                name: "IX_User_ChatRoomId",
                table: "User",
                newName: "IX_User_ChatId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Videos",
                table: "Videos",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "Chat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UrlEndPoint = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Chat", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_User_Chat_ChatId",
                table: "User",
                column: "ChatId",
                principalTable: "Chat",
                principalColumn: "Id");
        }
    }
}

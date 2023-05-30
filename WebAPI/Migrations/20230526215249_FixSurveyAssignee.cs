using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class FixSurveyAssignee : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "drafted",
                table: "SurveyAssignees");

            migrationBuilder.DropColumn(
                name: "submitted",
                table: "SurveyAssignees");

            migrationBuilder.AddColumn<string>(
                name: "status",
                table: "SurveyAssignees",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "status",
                table: "SurveyAssignees");

            migrationBuilder.AddColumn<bool>(
                name: "drafted",
                table: "SurveyAssignees",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "submitted",
                table: "SurveyAssignees",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}

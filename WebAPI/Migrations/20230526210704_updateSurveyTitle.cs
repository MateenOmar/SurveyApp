using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class updateSurveyTitle : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_SurveyAssiggnees",
                table: "SurveyAssiggnees");

            migrationBuilder.RenameTable(
                name: "SurveyAssiggnees",
                newName: "SurveyAssignees");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "Surveys",
                newName: "title");

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

            migrationBuilder.AddPrimaryKey(
                name: "PK_SurveyAssignees",
                table: "SurveyAssignees",
                columns: new[] { "surveyID", "userID" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_SurveyAssignees",
                table: "SurveyAssignees");

            migrationBuilder.DropColumn(
                name: "drafted",
                table: "SurveyAssignees");

            migrationBuilder.DropColumn(
                name: "submitted",
                table: "SurveyAssignees");

            migrationBuilder.RenameTable(
                name: "SurveyAssignees",
                newName: "SurveyAssiggnees");

            migrationBuilder.RenameColumn(
                name: "title",
                table: "Surveys",
                newName: "name");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SurveyAssiggnees",
                table: "SurveyAssiggnees",
                columns: new[] { "surveyID", "userID" });
        }
    }
}

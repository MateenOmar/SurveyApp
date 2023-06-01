using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class dbFixTest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SurveyUserAnswers_SurveyOptions_surveyID_questionID_answerID",
                table: "SurveyUserAnswers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SurveyOptions",
                table: "SurveyOptions");

            migrationBuilder.DropIndex(
                name: "IX_SurveyOptions_surveyID_questionID",
                table: "SurveyOptions");

            migrationBuilder.AlterColumn<string>(
                name: "title",
                table: "Surveys",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "status",
                table: "Surveys",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "priority",
                table: "Surveys",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "description",
                table: "Surveys",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "status",
                table: "SurveyAssignees",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SurveyOptions",
                table: "SurveyOptions",
                columns: new[] { "surveyID", "questionID", "answerID" });

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyUserAnswers_SurveyOptions_surveyID_questionID_answerID",
                table: "SurveyUserAnswers",
                columns: new[] { "surveyID", "questionID", "answerID" },
                principalTable: "SurveyOptions",
                principalColumns: new[] { "surveyID", "questionID", "answerID" },
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SurveyUserAnswers_SurveyOptions_surveyID_questionID_answerID",
                table: "SurveyUserAnswers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SurveyOptions",
                table: "SurveyOptions");

            migrationBuilder.AlterColumn<string>(
                name: "title",
                table: "Surveys",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "status",
                table: "Surveys",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "priority",
                table: "Surveys",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "description",
                table: "Surveys",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "status",
                table: "SurveyAssignees",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_SurveyOptions",
                table: "SurveyOptions",
                columns: new[] { "answerID", "surveyID", "questionID" });

            migrationBuilder.CreateIndex(
                name: "IX_SurveyOptions_surveyID_questionID",
                table: "SurveyOptions",
                columns: new[] { "surveyID", "questionID" });

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyUserAnswers_SurveyOptions_surveyID_questionID_answerID",
                table: "SurveyUserAnswers",
                columns: new[] { "surveyID", "questionID", "answerID" },
                principalTable: "SurveyOptions",
                principalColumns: new[] { "answerID", "surveyID", "questionID" },
                onDelete: ReferentialAction.Cascade);
        }
    }
}

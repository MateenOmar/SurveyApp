using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class fixFK : Migration
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

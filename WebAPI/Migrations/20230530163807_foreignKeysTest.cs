using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class foreignKeysTest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_SurveyUserAnswers_surveyID_questionID_answerID",
                table: "SurveyUserAnswers",
                columns: new[] { "surveyID", "questionID", "answerID" });

            migrationBuilder.CreateIndex(
                name: "IX_SurveyUserAnswers_userID",
                table: "SurveyUserAnswers",
                column: "userID");

            migrationBuilder.CreateIndex(
                name: "IX_SurveyAssignees_userID",
                table: "SurveyAssignees",
                column: "userID");

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyAssignees_Surveys_surveyID",
                table: "SurveyAssignees",
                column: "surveyID",
                principalTable: "Surveys",
                principalColumn: "surveyID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyAssignees_Users_userID",
                table: "SurveyAssignees",
                column: "userID",
                principalTable: "Users",
                principalColumn: "userID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyUserAnswers_SurveyOptions_surveyID_questionID_answerID",
                table: "SurveyUserAnswers",
                columns: new[] { "surveyID", "questionID", "answerID" },
                principalTable: "SurveyOptions",
                principalColumns: new[] { "answerID", "surveyID", "questionID" },
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyUserAnswers_SurveyQuestions_surveyID_questionID",
                table: "SurveyUserAnswers",
                columns: new[] { "surveyID", "questionID" },
                principalTable: "SurveyQuestions",
                principalColumns: new[] { "surveyID", "questionID" },
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SurveyUserAnswers_Users_userID",
                table: "SurveyUserAnswers",
                column: "userID",
                principalTable: "Users",
                principalColumn: "userID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SurveyAssignees_Surveys_surveyID",
                table: "SurveyAssignees");

            migrationBuilder.DropForeignKey(
                name: "FK_SurveyAssignees_Users_userID",
                table: "SurveyAssignees");

            migrationBuilder.DropForeignKey(
                name: "FK_SurveyUserAnswers_SurveyOptions_surveyID_questionID_answerID",
                table: "SurveyUserAnswers");

            migrationBuilder.DropForeignKey(
                name: "FK_SurveyUserAnswers_SurveyQuestions_surveyID_questionID",
                table: "SurveyUserAnswers");

            migrationBuilder.DropForeignKey(
                name: "FK_SurveyUserAnswers_Users_userID",
                table: "SurveyUserAnswers");

            migrationBuilder.DropIndex(
                name: "IX_SurveyUserAnswers_surveyID_questionID_answerID",
                table: "SurveyUserAnswers");

            migrationBuilder.DropIndex(
                name: "IX_SurveyUserAnswers_userID",
                table: "SurveyUserAnswers");

            migrationBuilder.DropIndex(
                name: "IX_SurveyAssignees_userID",
                table: "SurveyAssignees");
        }
    }
}

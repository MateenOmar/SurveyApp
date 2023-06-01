using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class dbFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Surveys",
                columns: table => new
                {
                    surveyID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    title = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    dueDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    numberOfQuestions = table.Column<int>(type: "int", nullable: false),
                    status = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    priority = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Surveys", x => x.surveyID);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    userID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    userName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    password = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    firstName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    lastName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    passwordKey = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    admin = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.userID);
                });

            migrationBuilder.CreateTable(
                name: "SurveyQuestions",
                columns: table => new
                {
                    surveyID = table.Column<int>(type: "int", nullable: false),
                    questionID = table.Column<int>(type: "int", nullable: false),
                    question = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    numberOfAnswers = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SurveyQuestions", x => new { x.surveyID, x.questionID });
                    table.ForeignKey(
                        name: "FK_SurveyQuestions_Surveys_surveyID",
                        column: x => x.surveyID,
                        principalTable: "Surveys",
                        principalColumn: "surveyID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SurveyAssignees",
                columns: table => new
                {
                    surveyID = table.Column<int>(type: "int", nullable: false),
                    userID = table.Column<int>(type: "int", nullable: false),
                    completionStatus = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SurveyAssignees", x => new { x.surveyID, x.userID });
                    table.ForeignKey(
                        name: "FK_SurveyAssignees_Surveys_surveyID",
                        column: x => x.surveyID,
                        principalTable: "Surveys",
                        principalColumn: "surveyID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SurveyAssignees_Users_userID",
                        column: x => x.userID,
                        principalTable: "Users",
                        principalColumn: "userID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SurveyOptions",
                columns: table => new
                {
                    surveyID = table.Column<int>(type: "int", nullable: false),
                    questionID = table.Column<int>(type: "int", nullable: false),
                    answerID = table.Column<int>(type: "int", nullable: false),
                    answer = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SurveyOptions", x => new { x.surveyID, x.questionID, x.answerID });
                    table.ForeignKey(
                        name: "FK_SurveyOptions_SurveyQuestions_surveyID_questionID",
                        columns: x => new { x.surveyID, x.questionID },
                        principalTable: "SurveyQuestions",
                        principalColumns: new[] { "surveyID", "questionID" },
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SurveyUserAnswers",
                columns: table => new
                {
                    surveyID = table.Column<int>(type: "int", nullable: false),
                    questionID = table.Column<int>(type: "int", nullable: false),
                    userID = table.Column<int>(type: "int", nullable: false),
                    answerID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SurveyUserAnswers", x => new { x.surveyID, x.questionID, x.userID });
                    table.ForeignKey(
                        name: "FK_SurveyUserAnswers_SurveyOptions_surveyID_questionID_answerID",
                        columns: x => new { x.surveyID, x.questionID, x.answerID },
                        principalTable: "SurveyOptions",
                        principalColumns: new[] { "surveyID", "questionID", "answerID" },
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SurveyUserAnswers_Users_userID",
                        column: x => x.userID,
                        principalTable: "Users",
                        principalColumn: "userID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SurveyAssignees_userID",
                table: "SurveyAssignees",
                column: "userID");

            migrationBuilder.CreateIndex(
                name: "IX_SurveyUserAnswers_surveyID_questionID_answerID",
                table: "SurveyUserAnswers",
                columns: new[] { "surveyID", "questionID", "answerID" });

            migrationBuilder.CreateIndex(
                name: "IX_SurveyUserAnswers_userID",
                table: "SurveyUserAnswers",
                column: "userID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SurveyAssignees");

            migrationBuilder.DropTable(
                name: "SurveyUserAnswers");

            migrationBuilder.DropTable(
                name: "SurveyOptions");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "SurveyQuestions");

            migrationBuilder.DropTable(
                name: "Surveys");
        }
    }
}

using Microsoft.EntityFrameworkCore;
using WebAPI.Interfaces;
using WebAPI.Models;

namespace WebAPI.Data.Repo
{
    public class SurveyRepository : ISurveyRepository
    {
        private readonly DataContext dc;

        public SurveyRepository(DataContext dc)
        {
            this.dc = dc;
        }

        public void AddSurvey(Survey survey)
        {
            dc.Surveys.Add(survey);
        }

        public void AddSurveyQuestion(SurveyQuestion surveyQ)
        {
            dc.SurveyQuestions.Add(surveyQ);
        }

        public void AddSurveyOption(SurveyOption surveyO)
        {
            dc.SurveyOptions.Add(surveyO);
        }

        public void DeleteSurvey(int surveyID)
        {
            var survey = dc.Surveys.Find(surveyID);
            dc.Surveys.Remove(survey);
        }

        public async Task<Survey> FindSurvey(int id)
        {
            return await dc.Surveys.FindAsync(id);
        }

        public async Task<IEnumerable<Survey>> GetAllSurveysAsync()
        {
            var surveys = await dc.Surveys.ToListAsync();
            return surveys;
        }

        public async Task<IEnumerable<int>> GetAllSurveyIDsAsync()
        {
            var surveyIDs = await dc.Surveys.Select(survey => survey.surveyID).ToListAsync();
            return surveyIDs;
        }
        public async Task<Survey> GetSurveyDetailAsync(int id)
        {
            var surveys = await dc.Surveys
            .Where(p => p.surveyID == id)
            .FirstAsync();
            return surveys;
        }

        public async Task<IEnumerable<SurveyQuestion>> GetSurveyQuestionsAsync(int surveyID)
        {
            var questions = await dc.SurveyQuestions
            .Where(p => p.surveyID == surveyID)
            .ToListAsync();

            return questions;
        }

        public async Task<IEnumerable<SurveyOption>> GetQuestionsOptionsAsync(int surveyID, int questionID)
        {
            var answers = await dc.SurveyOptions
            .Where(p => p.surveyID == surveyID)
            .Where(p => p.questionID == questionID)
            .ToListAsync();

            return answers;
        }

        public void AddUserAnswer(SurveyUserAnswer userAnswer)
        {
            dc.SurveyUserAnswers.Add(userAnswer);
        }

        public void AssignUser(SurveyAssignee surveyAssignee)
        {
            dc.SurveyAssignees.Add(surveyAssignee);
        }

        public async Task<IEnumerable<SurveyAssignee>> GetSurveyAssigneesBySurveyAsync(int surveyID)
        {
            var assignees = await dc.SurveyAssignees
            .Where(p => p.surveyID == surveyID)
            .ToListAsync();

            return assignees;
        }

        public async Task<IEnumerable<Survey>> GetSurveysAssignedToUserAsync(int userID)
        {

            var assignedSurveys = await dc.Surveys
            .Where(survey => survey.status == "Published" && 
                    dc.SurveyAssignees.Any(
                        assignee => assignee.surveyID == survey.surveyID && assignee.userID == userID))
            .ToListAsync();

            return assignedSurveys;
        }

        public void DeleteSurveyAssignee(int surveyID, int userID)
        {   
            var assignee = dc.SurveyAssignees.Find(surveyID, userID);

            dc.SurveyAssignees.Remove(assignee);
        }

        public async Task<string> GetSurveyAssigneeStatusAsync(int userID, int surveyID)
        {
            var completionStatus = await dc.SurveyAssignees
            .Where(assignee => assignee.userID == userID && assignee.surveyID == surveyID)
            .Select(assignee => assignee.completionStatus).FirstAsync();

            return completionStatus;
        }
    }
}
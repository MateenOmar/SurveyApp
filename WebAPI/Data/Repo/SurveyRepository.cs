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

        // TO BE IMPLEMENTED
        public void DeleteSurvey(int surveyID)
        {
            var survey = dc.Surveys.Find(surveyID);
            dc.Surveys.Remove(survey);
        }

        public async Task<Survey> FindSurvey(int id)
        {
            return await dc.Surveys.FindAsync(id);
        }

        public async Task<IEnumerable<Survey>> GetSurveysAsync(string type)
        {
            var surveys = await dc.Surveys
            .ToListAsync();
            return surveys;
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
    }
}
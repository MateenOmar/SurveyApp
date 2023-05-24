using System.Security.Cryptography;
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
            var surveys = await dc.Surveys.FirstAsync(id);
            return surveys;
        }

    }
}
using WebAPI.Models;

namespace WebAPI.Interfaces
{
    public interface ISurveyRepository
    {
        Task<IEnumerable<Survey>> GetSurveysAsync(string type);
        Task<Survey> GetSurveyDetailAsync(int id);
        void AddSurvey(Survey survey);
        void DeleteSurvey(int id);
        Task<Survey> FindSurvey(int id);
    }
}
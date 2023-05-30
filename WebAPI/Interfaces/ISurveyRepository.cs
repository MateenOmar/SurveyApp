using WebAPI.Models;

namespace WebAPI.Interfaces
{
    public interface ISurveyRepository
    {
        Task<IEnumerable<Survey>> GetSurveysAsync(string type);
        
        Task<Survey> GetSurveyDetailAsync(int id);
        void AddSurvey(Survey survey);
        void AddSurveyQuestion(SurveyQuestion surveyQ);

        void AddSurveyOption(SurveyOption surveyO);
        void DeleteSurvey(int id);
        Task<Survey> FindSurvey(int id);

        Task<IEnumerable<SurveyQuestion>> GetSurveyQuestionsAsync(int surveyID);

        Task<IEnumerable<SurveyOption>> GetQuestionsOptionsAsync(int surveyID, int questionID);

        void AddUserAnswer(SurveyUserAnswer userAnswer);

        void AssignUser(SurveyAssignee surveyAssignee);

        Task<IEnumerable<SurveyAssignee>> GetSurveyAssigneesBySurveyAsync(int surveyID);

        Task<IEnumerable<SurveyAssignee>> GetSurveysAssignedToUserAsync(int userID);

        void DeleteSurveyAssignee(int surveyID, int userID);
    
    }
}
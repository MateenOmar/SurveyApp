using Microsoft.EntityFrameworkCore;

namespace WebAPI.Models
{
    [PrimaryKey("surveyID", "questionID", "userID")]
    public class SurveyUserAnswer
    {
        public int surveyID { get; set; }
        public int questionID { get; set; }
        public int userID { get; set; }
        public int answerID { get; set; }
    }
}
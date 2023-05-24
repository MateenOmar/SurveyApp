using Microsoft.EntityFrameworkCore;

namespace WebAPI.Models
{
    [PrimaryKey("surveyID", "userID")]
    public class SurveyAssignee
    {
        public int surveyID { get; set; }
        public int userID { get; set; }
    }
}
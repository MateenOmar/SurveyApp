using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Models
{
    [PrimaryKey("surveyID", "questionID", "userID")]
    public class SurveyUserAnswer
    {
        public int surveyID { get; set; }

        public int questionID { get; set; }

        public int userID{ get; set; }

        public int answerID { get; set; }

        [ForeignKey("userID")]
        public User User { get; set; }

        [ForeignKey("surveyID, questionID, answerID")]
        
        public SurveyOption SurveyOption { get; set; }
    }
}
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Models
{
    [PrimaryKey("surveyID", "questionID", "userID")]
    public class SurveyUserAnswer
    {
        [Required]
        public int surveyID { get; set; }
        [Required]
        public int questionID { get; set; }
        [Required]
        public int userID { get; set; }
        [Required]
        public int answerID { get; set; }

        [ForeignKey("userID")]
        public User User { get; set; }

        [ForeignKey("surveyID, questionID")]
        public SurveyQuestion SurveyQuestion { get; set; }

        [ForeignKey("surveyID, questionID, answerID")]
        public SurveyOption SurveyOption { get; set; }
    }
}
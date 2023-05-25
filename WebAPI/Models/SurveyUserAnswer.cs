using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Models
{
    [PrimaryKey("surveyID", "questionID", "userID")]
    public class SurveyUserAnswer
    {
        [Required]
        [ForeignKey("Survey")]
        public int surveyID { get; set; }
        [Required]
        [ForeignKey("SurveyQuestion")]
        public int questionID { get; set; }
        [Required]
        [ForeignKey("User")]
        public int userID { get; set; }
        [Required]
        [ForeignKey("SurveyOption")]
        public int answerID { get; set; }
    }
}
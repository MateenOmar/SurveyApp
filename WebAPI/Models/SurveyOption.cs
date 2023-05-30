using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Models
{
    [PrimaryKey("answerID", "surveyID", "questionID")]
    public class SurveyOption
    {
        [Required]
        public int answerID { get; set; }

        [Required]
        public int questionID { get; set; }
        
        [Required]
        public int surveyID { get; set; }

        [Required]
        public string answer { get; set; }

        [ForeignKey("surveyID, questionID")]
        public SurveyQuestion SurveyQuestion { get; set; }

        //public Survey Survey { get; set; }
    }
}
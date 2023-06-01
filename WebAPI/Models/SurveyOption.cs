using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Models
{
    [PrimaryKey("surveyID", "questionID", "answerID")]
    public class SurveyOption
    {
        public int surveyID { get; set; }

        public int questionID { get; set; }

        [Required]
        public int answerID { get; set; }

        [Required]
        public string answer { get; set; }


        [ForeignKey("surveyID, questionID")]
        public SurveyQuestion SurveyQuestion { get; set; }

        //public Survey Survey { get; set; }
    }
}
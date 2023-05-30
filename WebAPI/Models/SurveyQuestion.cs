using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Models
{
    [PrimaryKey("surveyID", "questionID")]
    public class SurveyQuestion
    {
        [Required]
        public int questionID { get; set; }

        [Required]
        public int surveyID { get; set; }

        [Required]
        public string question { get; set; }

        [Required]
        public int numberOfAnswers { get; set; }

        [ForeignKey("surveyID")]
        public Survey Survey { get; set; }

        public ICollection<SurveyOption> SurveyOptions { get; set; }
    }
}
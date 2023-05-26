using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Models
{
    [PrimaryKey("surveyID", "userID")]
    public class SurveyAssignee
    {
        [Required]
        [ForeignKey("Survey")]
        public int surveyID { get; set; }
        [Required]
        [ForeignKey("User")]
        public int userID { get; set; }
        public bool drafted { get; set; } = false;
        public bool submitted { get; set; } = false;
    }
}
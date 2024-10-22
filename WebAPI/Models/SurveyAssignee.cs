using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Models
{
    [PrimaryKey("surveyID", "userID")]
    public class SurveyAssignee
    {
        public int surveyID { get; set; }

        public int userID { get; set; }
      
        public string completionStatus { get; set; } = "Assigned";

        [ForeignKey("surveyID")]
        public Survey Survey { get; set; }

        [ForeignKey("userID")]
        public User User { get; set; }
    }
}
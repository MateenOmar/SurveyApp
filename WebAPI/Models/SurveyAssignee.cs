using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Models
{
    [PrimaryKey("surveyID", "userID")]
    public class SurveyAssignee
    {
        public string status { get; set; } = "Assigned";
        public int surveyID { get; set; }
        public int userID { get; set; }

        [ForeignKey("surveyID")]
        public Survey Survey { get; set; }

        [ForeignKey("userID")]
        public User User { get; set; }
    }
}
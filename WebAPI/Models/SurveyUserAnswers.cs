using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Models
{
    [PrimaryKey("surveyID, questionID, userID")]
    public class SurveyUserAnswer
    {
        public int surveyID { get; set; }
        public int questionID { get; set; }
        public int userID { get; set; }
        public int answerID { get; set; }
    }
}
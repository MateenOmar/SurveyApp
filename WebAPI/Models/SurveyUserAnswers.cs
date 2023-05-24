using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    [PrimaryKey("surveyID, questionID, userID")]
    public class SurveyUserAnswers
    {
        public int surveyID { get; set; }
        public int questionID { get; set; }
        public int userID { get; set; }
        public int answerID { get; set; }
    }
}
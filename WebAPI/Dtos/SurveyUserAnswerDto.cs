using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Dtos
{
    public class SurveyUserAnswerDto
    {
        // public int surveyID { get; set; }
        public int questionID { get; set; }
        public int answerID { get; set; }
        public int userID { get; set; }

        
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Dtos
{
    public class SurveyUserAnswerDto
    {
        public int surveyID { get; set; }
        public string username { get; set; }
        public List<UserAnswerDto> questionAndAnswerIDs { get; set; }
    }
}
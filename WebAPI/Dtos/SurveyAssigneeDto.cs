using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Dtos
{
    public class SurveyAssigneeDto
    {
        public int surveyID { get; set; }
        public int userID { get; set; }
        public string completionStatus { get; set; }
    }
}
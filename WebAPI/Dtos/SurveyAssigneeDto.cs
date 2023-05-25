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
        public bool drafted { get; set; }
        public bool submitted { get; set; }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    [PrimaryKey("surveyID, userID")]
    public class SurveyAssignees
    {
        public int surveyID { get; set; }
        public int userID { get; set; }
    }
}
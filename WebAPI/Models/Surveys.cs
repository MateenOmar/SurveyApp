using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class Surveys
    {
        public int surveyID { get; set; }
        public string name { get; set; }
        public DateTime dueDate { get; set; }
        public string description { get; set; }
        public int numberOfQuestions { get; set; }
        public bool published { get; set; }
        public int priority { get; set; }
        // public bool Archived { get; set; } = false


    }
}
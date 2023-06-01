using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Dtos
{
    public class AssignedSurveysDto
    {
        public int surveyID { get; set; }
        [Required]
        public string title { get; set; }
        [Required]
        public DateTime dueDate { get; set; }
        [Required]
        public string description { get; set; }
        [Required]
        public int numberOfQuestions { get; set; }
        [Required]
        public string status { get; set; }
        public string priority { get; set; }
        public string completionStatus { get; set; }
    }
}
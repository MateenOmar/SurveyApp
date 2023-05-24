using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Dtos
{
    public class SurveyDto
    {
        public int id { get; set; }
        [Required]
        public string name { get; set; }
        [Required]
        public DateTime dueDate { get; set; }
        [Required]
        public string description { get; set; }
        [Required]
        public int numberOfQuestions { get; set; }
        [Required]
        public bool published { get; set; }
        public int priority { get; set; }
    }
}
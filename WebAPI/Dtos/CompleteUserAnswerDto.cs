using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Dtos
{
    public class CompleteUserAnswerDto
    {

        public int questionID { get; set; }
        public string question { get; set; }
        public int answerID { get; set; }
        public string answer { get; set; }
        
    }
}
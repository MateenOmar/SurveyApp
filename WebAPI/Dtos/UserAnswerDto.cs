using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Dtos
{
    public class UserAnswerDto
    {
        public int questionID { get; set; }
        public int answerID { get; set; }
    }
}
using Newtonsoft.Json.Linq;

namespace WebAPI.Dtos
{
    public class SurveyCompleteDto
    {
        public int surveyID { get; set; }

        public string name { get; set; }

        public DateTime dueDate { get; set; }

        public string description { get; set; }

        public int numberOfQuestions { get; set; }

        public string status { get; set; }

        public string priority { get; set; }

        public List<JObject> questions { get; set; }
    }
}
namespace WebAPI.Dtos
{
    public class SurveyQuestionDto
    {
        public int questionID { get; set; }

        public string question { get; set; }

        public int numberOfAnswers { get; set; }
    }
}
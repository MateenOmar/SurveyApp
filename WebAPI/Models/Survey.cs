namespace WebAPI.Models
{
    public class Survey
    {
        public int surveyID { get; set; }
        public string title { get; set; }
        public DateTime dueDate { get; set; }
        public string description { get; set; }
        public int numberOfQuestions { get; set; }
        public string status { get; set; }
        public string priority { get; set; }
        // public bool Archived { get; set; } = false


    }
}
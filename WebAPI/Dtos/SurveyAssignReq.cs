namespace WebAPI.Dtos
{
    public class SurveyAssignReq
    {
        public int surveyID { get; set; }
        
        public string[] assignees { get; set; }
    }
}
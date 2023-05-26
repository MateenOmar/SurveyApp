using Microsoft.EntityFrameworkCore;
using WebAPI.Models;

namespace WebAPI.Data
{
    public class DataContext :DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) :base(options) 
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Survey> Surveys { get; set; }

        public DbSet<SurveyAssignee> SurveyAssiggnees { get; set; }

        public DbSet<SurveyUserAnswer> SurveyUserAnswers { get; set; }

        public DbSet<SurveyQuestion> SurveyQuestions { get; set; }

        public DbSet<SurveyOption> SurveyOptions { get; set; }

    }
}

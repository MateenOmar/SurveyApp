namespace WebAPI.Interfaces
{
    public interface IUnitOfWork
    {

        IUserRepository UserRepository { get; }
        ISurveyRepository SurveyRepository { get; }

         Task<bool> SaveAsync();    
    }
}
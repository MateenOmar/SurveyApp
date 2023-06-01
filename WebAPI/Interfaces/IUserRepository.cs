using WebAPI.Models;

namespace WebAPI.Interfaces
{
    public interface IUserRepository
    {
        Task<User> Authenticate(string userName, string password);

        void Register(string userName, string password, string firstName, string lastName, string email);

        Task<bool> UserAlreadyExists(string userName);

        Task<IEnumerable<User>> GetUsersAsync();

        Task<User> GetUserNameAsync(int userID);

        Task<User> GetUserAsync(string userName);

        void DeleteUser(string userName);
    }
}
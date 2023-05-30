using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using WebAPI.Interfaces;
using WebAPI.Models;

namespace WebAPI.Data.Repo
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext dc;

        public UserRepository(DataContext dc)
        {
            this.dc = dc;
        }

        public async Task<User> Authenticate(string userName, string passwordText)
        {
            var user = await dc.Users.FirstOrDefaultAsync(x => x.userName == userName);

            if(user == null || user.passwordKey == null) 
                return null;

            if(!MatchPasswordHash(passwordText, user.password, user.passwordKey))
                return null;

            return user;
        }

        private bool MatchPasswordHash(string passwordText, byte[] password, byte[] passwordKey)
        {
             using (var hmac = new HMACSHA512(passwordKey)) {
                var passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(passwordText));

                for(int i=0; i < passwordHash.Length; i++){
                    if(password[i] != passwordHash[i])
                        return false;
                }

                return true;
            }
        }

        public void Register(string userName, string password, string firstName, string lastName, string email)
        {
            byte[] passwordHash, passwordKey;

            using (var hmac = new HMACSHA512()) {
                passwordKey = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }

            User user = new User();
            user.userName = userName;
            user.password = passwordHash;
            user.firstName = firstName;
            user.lastName = lastName;
            user.email = email;
            user.passwordKey = passwordKey;

            dc.Users.Add(user);
        }

        public async Task<bool> UserAlreadyExists(string userName)
        {
            return await dc.Users.AnyAsync(x => x.userName == userName);
        }

        public async Task<IEnumerable<User>> GetUsersAsync()
        {
            var users = await dc.Users
            .Where(p => p.admin != true)
            .ToListAsync();
            return users;
        }

        public async Task<User> GetUserAsync(string userName)
        {
            var user = await dc.Users
            .Where(p => p.userName == userName)
            .FirstAsync();
            return user;
        }

        public void DeleteUser(string userName)
        {
            var user = GetUserAsync(userName).Result;
            dc.Users.Remove(user);
        }
    }
}
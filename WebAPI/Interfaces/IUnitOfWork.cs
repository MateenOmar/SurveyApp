using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Interfaces
{
    public interface IUnitOfWork
    {

        IUserRepository UserRepository { get; }
        ISurveyRepository SurveyRepository { get; }

         Task<bool> SaveAsync();    
    }
}
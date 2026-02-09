using WatchVideoApi.Models;

namespace WatchVideoApi.Interfaces;

public interface IUserRepository
{
    Task<User> CreateUser(string userName);
    Task<User> DeleteUser(string userId);
    Task<User> GetUserById(string userId);
    Task<User> GetUserByName(string name);
    Task<List<User>> GetUsers();
}
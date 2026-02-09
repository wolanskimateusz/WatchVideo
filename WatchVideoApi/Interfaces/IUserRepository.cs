using WatchVideoApi.Models;

namespace WatchVideoApi.Interfaces;

public interface IUserRepository
{
    Task<User> CreateUser(string userName);
    Task<User> DeleteUser(int userId);
    Task<User> GetUserById(int userId);
    Task<User> GetUserByName(string name);
    Task<List<User>> GetUsers();
}
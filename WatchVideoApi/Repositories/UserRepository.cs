using Microsoft.EntityFrameworkCore;
using WatchVideoApi.Data;
using WatchVideoApi.Interfaces;
using WatchVideoApi.Models;

namespace WatchVideoApi.Repositories;

public class UserRepository: IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<User> CreateUser(string userName)
    {
           var newUser = new User();
           newUser.Name = userName;
           await _context.User.AddAsync(newUser);
           await _context.SaveChangesAsync();
           return newUser;
    }

    public async Task<User> DeleteUser(string userId)
    {
        var user = await _context.User.FirstOrDefaultAsync(x => x.Id == userId);
        if (user == null) return null;
        _context.User.Remove(user);
        await _context.SaveChangesAsync();
        return  user;
    }

    public async Task<User> GetUserById(string userId)
    {
        var user = await _context.User.FirstOrDefaultAsync(x => x.Id == userId);
        if (user == null) return null;
        return user;
    }

    public async Task<User> GetUserByName(string name)
    {
        var user = await _context.User.FirstOrDefaultAsync(x=> x.Name == name);
        if (user == null) return null;
        return user;
    }

    public async Task<List<User>> GetUsers()
    {
        var users = await _context.User.ToListAsync();
        if (users == null) return null;
        return users;
    }
}
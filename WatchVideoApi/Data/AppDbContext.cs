using Microsoft.EntityFrameworkCore;
using WatchVideoApi.Models;

namespace WatchVideoApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions options)
        :base(options)
    {
     
    }
    
    public DbSet<Video> Video { get; set; }
    public DbSet<User> User { get; set; }
    public DbSet<ChatRoom> ChatRoom { get; set; }
}
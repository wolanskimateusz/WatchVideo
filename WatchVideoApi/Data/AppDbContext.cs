using Microsoft.EntityFrameworkCore;
using WatchVideoApi.Models;

namespace WatchVideoApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions options)
        :base(options)
    {
     
    }
    
    public DbSet<Video> Videos { get; set; }
}
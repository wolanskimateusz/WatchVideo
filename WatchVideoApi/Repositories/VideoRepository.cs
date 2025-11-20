using WatchVideoApi.Data;
using WatchVideoApi.Interfaces;
using WatchVideoApi.Models;

namespace WatchVideoApi.Repositories;

public class VideoRepository : IVideoRepository
{
    private readonly AppDbContext _context;

    public VideoRepository(AppDbContext context)
    {
        _context = context;
    }
    
    public string GetVideoName()
    {
        var name = _context.Videos.FirstOrDefault(x => x.Id == 1)?.Name;
        return name;
    }
}
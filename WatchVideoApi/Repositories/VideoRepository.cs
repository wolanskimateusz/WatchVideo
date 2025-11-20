using WatchVideoApi.Interfaces;
using WatchVideoApi.Models;

namespace WatchVideoApi.Repositories;

public class VideoRepository : IVideoRepository
{
    private Video video1 = new Video();
    
    public string GetVideoName()
    {
        return this.video1.Name;
    }
}
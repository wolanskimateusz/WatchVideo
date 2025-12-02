using WatchVideoApi.Data;
using WatchVideoApi.Models;

public class ChatService
{
    private readonly AppDbContext _db;

    public ChatService(AppDbContext db)
    {
        _db = db;
    }
    
}

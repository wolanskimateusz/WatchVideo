using WatchVideoApi.Data;
using WatchVideoApi.Interfaces;
using WatchVideoApi.Models;

namespace WatchVideoApi.Repositories;

public class ChatRoomRepository :  IChatRoomRepository
{
    private readonly AppDbContext _context;

    public ChatRoomRepository(AppDbContext context)
    {
        _context = context;
    }
    public async Task<ChatRoom> CreateChatRoomAsync()
    {
        var chatRoomModel = new ChatRoom();
        chatRoomModel.UrlEndPoint = CreateUrlEndpoint();
        await _context.AddAsync(chatRoomModel);
        await _context.SaveChangesAsync();
        
        return chatRoomModel;
    }
    
    private string CreateUrlEndpoint()
    {
        var rooms = _context.ChatRoom.Count();
        var url = $"room{rooms+1}";
        return url;
    }
}
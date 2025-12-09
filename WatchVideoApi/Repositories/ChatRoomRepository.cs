using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
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
    public async Task<ChatRoom> CreateChatRoomAsync()    //unikalny url dodac zabezpieczenia   
    {
        var chatRoomModel = new ChatRoom();
        chatRoomModel.UrlEndPoint = CreateUrlEndpoint();
        await _context.AddAsync(chatRoomModel);
        await _context.SaveChangesAsync();
    
        return chatRoomModel;  
    }

    public async Task<List<ChatRoom>> GetAllChatRoomsAsync()
    {
        var chatRooms = await _context.ChatRoom.ToListAsync();
        
        return chatRooms;
    }
    
    public async Task<ChatRoom> GetChatRoomByIdAsync(int roomId)
    {
        var chatroom = await _context.ChatRoom.FirstOrDefaultAsync(x => x.Id == roomId);
        if (chatroom == null) return null; 
        return chatroom;
    }

    public async Task<ChatRoom> GetChatRoomByUrlAsync(string url)
    {
        var chatroom = await _context.ChatRoom.FirstOrDefaultAsync(x => x.UrlEndPoint.Equals(url));
        if (chatroom == null) return null;
        return chatroom;
    }

    private string CreateUrlEndpoint()
    {
        var rooms = _context.ChatRoom.Count();
        var url = $"room{rooms+1}";
        return url;
    }
}
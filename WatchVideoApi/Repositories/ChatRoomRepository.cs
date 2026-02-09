using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using WatchVideoApi.Data;
using WatchVideoApi.Dtos;
using WatchVideoApi.Interfaces;
using WatchVideoApi.Models;

namespace WatchVideoApi.Repositories;

public class ChatRoomRepository :  IChatRoomRepository
{
    private readonly AppDbContext _context;
    private readonly IUserRepository _userRepo;

    public ChatRoomRepository(AppDbContext context,  IUserRepository userRepo)
    {
        _context = context;
        _userRepo = userRepo;
    }
    public async Task<ChatRoom> CreateChatRoomAsync(string roomName)       
    {
        var chatRoomModel = new ChatRoom();
        var room = await GetChatRoomByUrlAsync(roomName.Trim());
        if (room == null && !string.IsNullOrEmpty(roomName)) 
            chatRoomModel.UrlEndPoint = roomName.Trim();
        else chatRoomModel.UrlEndPoint = await CreateDefaultUrlEndpoint();
        await _context.AddAsync(chatRoomModel);
        await _context.SaveChangesAsync();
    
        return chatRoomModel;  
    }

    public async Task<List<ChatRoom>> GetAllChatRoomsAsync()
    {
        var chatRooms = await _context.ChatRoom.ToListAsync();
        
        return chatRooms;
    }
    
    public async Task<ChatRoom> GetChatRoomByIdAsync(string roomId)
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

    public async Task<ChatRoom> AddUserToRoomAsync(string userName, string roomId)
    {
        var user = await _userRepo.GetUserByName(userName);
        if (user == null) return null;
        var room = await  _context.ChatRoom
            .Include(r=> r.Users)
            .FirstOrDefaultAsync(x => x.Id == roomId);
        if (room == null) return null;
        room.Users.Add(user);
        await _context.SaveChangesAsync();
        return room;
    }

    private async Task<string> CreateDefaultUrlEndpoint()
    {
        var rooms = await _context.ChatRoom.CountAsync();
        var url = $"room{rooms+1}";
        return url;
    }
}
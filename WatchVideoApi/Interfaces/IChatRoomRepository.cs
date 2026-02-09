using WatchVideoApi.Dtos;
using WatchVideoApi.Models;

namespace WatchVideoApi.Interfaces;

public interface IChatRoomRepository
{
    Task<ChatRoom> CreateChatRoomAsync(string roomName);
    
    Task<List<ChatRoom>> GetAllChatRoomsAsync();
    
    Task<ChatRoom> GetChatRoomByIdAsync(string roomId);
    
    Task<ChatRoom> GetChatRoomByUrlAsync(string url);
    
    Task<ChatRoom> AddUserToRoomAsync(string userName, string roomId);
}
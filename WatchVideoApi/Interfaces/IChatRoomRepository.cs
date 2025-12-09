using WatchVideoApi.Models;

namespace WatchVideoApi.Interfaces;

public interface IChatRoomRepository
{
    Task<ChatRoom> CreateChatRoomAsync();
    
    Task<List<ChatRoom>> GetAllChatRoomsAsync();
    
    Task<ChatRoom> GetChatRoomByIdAsync(int roomId);
    
    Task<ChatRoom> GetChatRoomByUrlAsync(string url);
}
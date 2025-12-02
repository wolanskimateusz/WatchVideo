using WatchVideoApi.Models;

namespace WatchVideoApi.Interfaces;

public interface IChatRoomRepository
{
    Task<ChatRoom> CreateChatRoomAsync();
}
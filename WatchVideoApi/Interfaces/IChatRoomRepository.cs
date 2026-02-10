using WatchVideoApi.Dtos;
using WatchVideoApi.Models;

namespace WatchVideoApi.Interfaces;

public interface IChatRoomRepository
{
    ChatRoom CreateChatRoom(string roomName);
    
    List<ChatRoom> GetAllChatRooms();

    public ChatRoom GetChatRoomById(string roomId);


}
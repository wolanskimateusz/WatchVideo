using WatchVideoApi.Models;

namespace WatchVideoApi.Mappers;

public static class ChatRoomMapper
{
    public static ChatRoom ToChatRoomFromRoomState(this RoomState roomState)
    {
      return new ChatRoom()
        {
            Id = roomState.roomId,
            UrlEndPoint = roomState.roomId,
            Name = roomState.roomName,
        };
    }
}
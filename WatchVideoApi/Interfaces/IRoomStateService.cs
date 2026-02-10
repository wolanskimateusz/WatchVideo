using WatchVideoApi.Models;

namespace WatchVideoApi.Interfaces;

public interface IRoomStateService
{
    public RoomState GetRoom(string roomId);
    public void SetVideo(string roomId, string url);
    public Task AddUser(string roomId, string userName, string connectionId);

    public void RemoveUserByConnection(string connectionId);
    public List<RoomState> GetAllRooms();

    public void RemoveEmptyRoomsOlderThan(TimeSpan maxEmptyTime);
    
    public RoomState CreateRoom(string roomName);
}
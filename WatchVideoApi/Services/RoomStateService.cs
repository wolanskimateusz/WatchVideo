using System.Collections.Concurrent;
using WatchVideoApi.Models;

namespace WatchVideoApi.Services;

public class RoomStateService
{
    private ConcurrentDictionary<string, RoomState> _rooms = new();
    
    public RoomState GetRoom(string roomId)
    {
        return _rooms.GetOrAdd(roomId, id => new RoomState { roomId = id });
    }
    public void SetVideo(string roomId, string url)
    {
        var room = GetRoom(roomId);
        room.videoUrl = url;
        room.currTime = 0;
        room.isPlaying = false;
        
    }

    public void UpdateCurrTime(string roomId, double currTime)
    {
        var room = GetRoom(roomId);
        room.currTime = currTime;
    }
}
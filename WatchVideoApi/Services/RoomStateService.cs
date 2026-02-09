using System.Collections.Concurrent;
using WatchVideoApi.Interfaces;
using WatchVideoApi.Models;
using WatchVideoApi.Repositories;

namespace WatchVideoApi.Services;

public class RoomStateService
{
    private ConcurrentDictionary<string, RoomState> _rooms = new();
    
    private readonly IServiceProvider _serviceProvider;

    public RoomStateService(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
        
        Task.Run(async () =>
        {
            var maxEmptyTime = TimeSpan.FromMinutes(1);

            while (true)
            {
                try
                {
                    RemoveEmptyRoomsOlderThan(maxEmptyTime);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Błąd przy czyszczeniu pokoi: {ex}");
                }

                await Task.Delay(TimeSpan.FromMinutes(1)); // sprawdzaj co minutę
            }
        });
    }
    
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
    public async Task AddUser(string roomId, string userName, string connectionId)
    {
        var room = GetRoom(roomId);
        if (!room.users.Any(u => u.ConnectionId == connectionId))
        {
            room.users.Add(new RoomUser { Name = userName, ConnectionId = connectionId });
            room.EmptySince = null; 
        }
    }

    public void RemoveUserByConnection(string connectionId)
    {
        foreach (var room in _rooms.Values)
        {
            var user = room.users.FirstOrDefault(u => u.ConnectionId == connectionId);
            if (user != null)
            {
                room.users.Remove(user);

                if (!room.users.Any())
                    room.EmptySince = DateTime.UtcNow; 
            }
        }
    }
    public List<RoomState> GetAllRooms() => _rooms.Values.ToList();
    
    public void RemoveEmptyRoomsOlderThan(TimeSpan maxEmptyTime)
    {
        var now = DateTime.UtcNow;
        var emptyRooms = _rooms.Values
            .Where(r => r.EmptySince.HasValue && now - r.EmptySince.Value > maxEmptyTime)
            .ToList();

        foreach (var room in emptyRooms)
            _rooms.TryRemove(room.roomId, out _);
    }
}
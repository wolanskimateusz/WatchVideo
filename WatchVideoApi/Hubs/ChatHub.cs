using Microsoft.AspNetCore.SignalR;
using System.Text.RegularExpressions;
using WatchVideoApi.Services;

public class ChatHub : Hub
{
    private readonly RoomStateService _roomStateService;

    public ChatHub(RoomStateService roomStateService)
    {
        _roomStateService = roomStateService;
    }
    public async Task JoinRoom(string roomId, string userName)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
        var room = _roomStateService.GetRoom(roomId);
        await Clients.Caller.SendAsync("SyncRoomState", room.videoUrl, room.currTime, room.isPlaying);
    }

    public async Task LeaveRoom(string roomId, string userName)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId);
    }

    public async Task SendMessageToRoom(string roomId, string userName, string message)
    {
        await Clients.Group(roomId)
            .SendAsync("ReceiveMessage", userName, message);
    }

    public async Task StartVideo(string roomId, double currTime)
    {
        var room = _roomStateService.GetRoom(roomId);
        room.isPlaying = true;
        await Clients.Group(roomId).SendAsync("StartVideo", currTime);
    }
    
    public async Task PauseVideo(string roomId)
    {   var room = _roomStateService.GetRoom(roomId);
        room.isPlaying = false;
        await Clients.Group(roomId).SendAsync("PauseVideo");
    }
    
    public async Task ChangeVideo(string roomId, string url)
    {
        _roomStateService.SetVideo(roomId, url);
        await Clients.Group(roomId).SendAsync("VideoChange", url);
    }

    public async Task UpdateCurrTime(string roomId, double currTime)
    {
        if (string.IsNullOrEmpty(roomId))
            throw new HubException("roomId is null or empty");
        
        var room = _roomStateService.GetRoom(roomId);
        room.currTime = currTime;
        
        Console.WriteLine($"Updated room {roomId} currentTime={currTime}");
    }
}

using Microsoft.AspNetCore.SignalR;
using System.Text.RegularExpressions;
using WatchVideoApi.Dtos;
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
        await  _roomStateService.AddUser(roomId, userName, Context.ConnectionId);

        await Clients.Group(roomId).SendAsync("ReceiveSystemMessage", $"{userName} joined room");
        await Clients.Caller.SendAsync("SyncRoomState", room.videoUrl, room.currTime, room.isPlaying);

        await UpdateUsers(roomId);
    }

    public async Task LeaveRoom(string roomId, string userName)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId);
        _roomStateService.RemoveUserByConnection(Context.ConnectionId);

        await Clients.Group(roomId).SendAsync("ReceiveSystemMessage", $"{userName} left room");
        await UpdateUsers(roomId);
    }
    
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        _roomStateService.RemoveUserByConnection(Context.ConnectionId);

        
        foreach (var room in _roomStateService.GetAllRooms())
        {
            await UpdateUsers(room.roomId);
        }

        await base.OnDisconnectedAsync(exception);
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
    
    public async Task ChangeVideo(string roomId, string url, string userName, string videoTitle)
    {
        _roomStateService.SetVideo(roomId, url);
        await Clients.Group(roomId).SendAsync("VideoChange", url);
        await Clients.Group(roomId).SendAsync("ReceiveSystemMessage", $"{userName} changed video to {videoTitle}");
    }

    public async Task UpdateCurrTime(string roomId, double currTime)
    {
        if (string.IsNullOrEmpty(roomId))
            throw new HubException("roomId is null or empty");
        
        var room = _roomStateService.GetRoom(roomId);
        room.currTime = currTime;
        
        Console.WriteLine($"Updated room {roomId} currentTime={currTime}");
    }

    public async Task UpdateUsers(string roomId)
    {
        var room = _roomStateService.GetRoom(roomId);
        var dto = new RoomUsersDto
        {
            RoomId = roomId,
            Users = room.users.Select(u => new UserDto {userName = u.Name}).ToList()
        };
        
        await Clients.Group(roomId).SendAsync("RoomUsersUpdated", dto);
    }
    
}

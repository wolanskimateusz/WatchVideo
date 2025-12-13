using Microsoft.AspNetCore.SignalR;
using System.Text.RegularExpressions;

public class ChatHub : Hub
{
    public async Task JoinRoom(string roomId, string userName)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
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
}

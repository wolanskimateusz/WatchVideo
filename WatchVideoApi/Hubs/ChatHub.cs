using Microsoft.AspNetCore.SignalR;
using System.Text.RegularExpressions;

public class ChatHub : Hub
{
    public async Task JoinChat(string chatId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, chatId);
    }

    public async Task LeaveChat(string chatId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, chatId);
    }

    public async Task SendMessage(string chatId, string message)
    {
        await Clients.Group(chatId).SendAsync("ReceiveMessage", new
        {
            ChatId = chatId,
            UserId = Context.UserIdentifier,
            Message = message,
            Timestamp = DateTime.UtcNow
        });
    }
}

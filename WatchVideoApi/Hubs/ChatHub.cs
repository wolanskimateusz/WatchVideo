using Microsoft.AspNetCore.SignalR;

namespace WatchVideoApi.Hubs;

public class ChatHub : Hub
{
    public async Task SendMessage(string user, string message)
    {
        // Wysyła wiadomość do wszystkich klientów
        await Clients.All.SendAsync("ReceiveMessage", user, message);
    }
}
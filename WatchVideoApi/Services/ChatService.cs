using WatchVideoApi.Data;
using WatchVideoApi.Models;

public class ChatService
{
    private readonly AppDbContext _db;

    public ChatService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Chat> CreateDirectChat(string userA)
    {
        var chat = new Chat {};
        _db.Chats.Add(chat);
        await _db.SaveChangesAsync();

        _db.ChatMembers.AddRange(
            new ChatMember { ChatId = chat.Id, UserId = userA }
        );

        await _db.SaveChangesAsync();
        return chat;
    }
}

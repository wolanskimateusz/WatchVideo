namespace WatchVideoApi.Models;

public class ChatRoom
{
    public int Id { get; set; }
    public string UrlEndPoint { get; set; } = String.Empty;
    public List<User> Users{ get; set; } = new List<User>();

}
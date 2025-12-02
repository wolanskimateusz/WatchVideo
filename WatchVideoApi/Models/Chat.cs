namespace WatchVideoApi.Models;

public class Chat
{
    public int Id { get; set; }
    public string UrlEndPoint { get; set; }
    public List<User> Users{ get; set; } = new List<User>();

}
namespace WatchVideoApi.Models;

public class RoomState
{
    public string videoUrl { get; set; } = string.Empty;
    public string roomId { get; set; } = string.Empty;
    public double currTime { get; set; }
    public Boolean isPlaying { get; set; } = false;
    public List<User> users { get; set; } = new List<User>();
}
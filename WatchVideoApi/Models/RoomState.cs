using System.ComponentModel.DataAnnotations;

namespace WatchVideoApi.Models;

public class RoomState
{
    public string videoUrl { get; set; } = string.Empty;
    [Key]
    public string roomId { get; set; } = Guid.NewGuid().ToString();
    public double currTime { get; set; }
    public Boolean isPlaying { get; set; } = false;
    public List<RoomUser> users { get; set; } = new List<RoomUser>();
    
    public DateTime? EmptySince { get; set; }
    
    public string roomName { get; set; } = string.Empty;
    
    
    
}

public class RoomUser
{
    public string Name { get; set; } = string.Empty;
    public string ConnectionId { get; set; } = string.Empty;
}
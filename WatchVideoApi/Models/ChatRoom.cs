using System.ComponentModel.DataAnnotations;

namespace WatchVideoApi.Models;

public class ChatRoom
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    [Required]
    public string UrlEndPoint { get; set; } = String.Empty;
    
    public List<User> Users { get; set; } = new List<User>();
    
    public string Name { get; set; } = string.Empty;
    

}
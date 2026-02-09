using System.ComponentModel.DataAnnotations;

namespace WatchVideoApi.Models;

public class User
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Name { get; set; } = "name 1";
}
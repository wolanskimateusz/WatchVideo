using WatchVideoApi.Models;

namespace WatchVideoApi.Dtos;

public class RoomUsersDto
{
    public string RoomId { get; set; }
    public List<UserDto> Users { get; set; } = new();
}
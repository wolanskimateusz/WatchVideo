using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using WatchVideoApi.Dtos;
using WatchVideoApi.Interfaces;

using WatchVideoApi.Models;

namespace WatchVideoApi.Controllers;

[ApiController]
[Route("api/chatroom")]
public class ChatRoomController : Controller
{
    private readonly IChatRoomRepository _chatRoomRepo;

    public ChatRoomController(IChatRoomRepository chatRoomRepository)
    {
        _chatRoomRepo = chatRoomRepository;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateRoomDto request)
    { 
        var roomName = request?.roomName;
       var createdRoom =  await _chatRoomRepo.CreateChatRoomAsync(roomName);
       return CreatedAtAction(nameof(GetChatRoomById), new { id = createdRoom.Id }, createdRoom);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
       var chatrooms =  await _chatRoomRepo.GetAllChatRoomsAsync();
       if (chatrooms != null)
        return Ok(chatrooms);
       else
        return NotFound();
    }

    [HttpGet("d/{id}")]
    public async Task<IActionResult> GetChatRoomById(string id)
    {
        var chatroom = await _chatRoomRepo.GetChatRoomByIdAsync(id);
        if (chatroom != null) return Ok(chatroom);
        return NotFound();
    }

    [HttpGet("{url}")]
    public async Task<IActionResult> GetChatRoomByUrl(string url)
    {
        var chatroom = await _chatRoomRepo.GetChatRoomByUrlAsync(url);
        if (chatroom != null) return Ok(chatroom);
        return NotFound();
    }
    [HttpPut("{id}")]
    public async Task<IActionResult> AddUserToRoomAsync([FromBody] CreateUserDto user, [FromRoute]string id)
    {
        var name = user.userName;
        var room = await _chatRoomRepo.AddUserToRoomAsync(name, id);
        if (room == null) return NotFound();
        return Ok(user);

    }
}
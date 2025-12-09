using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

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
    public async Task<IActionResult> Create()
    {
        
       var createdRoom =  await _chatRoomRepo.CreateChatRoomAsync();
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
    public async Task<IActionResult> GetChatRoomById(int id)
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
}
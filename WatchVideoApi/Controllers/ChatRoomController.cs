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
    public IActionResult Create([FromBody] CreateRoomDto request)
    { 
        var roomName = request?.roomName;
       var createdRoom =  _chatRoomRepo.CreateChatRoom(roomName);
       return CreatedAtAction(nameof(GetChatRoomById), new { id = createdRoom.Id }, createdRoom);
    }

    [HttpGet]
    public IActionResult GetAll()
    {
       var chatrooms = _chatRoomRepo.GetAllChatRooms();
       if (chatrooms != null)
        return Ok(chatrooms);
       else
        return NotFound();
    }

    [HttpGet("{id}")]
    public IActionResult GetChatRoomById(string id)
    {
        var chatroom = _chatRoomRepo.GetChatRoomById(id);
        if (chatroom != null) return Ok(chatroom);
        return NotFound();
    }

    
    
}
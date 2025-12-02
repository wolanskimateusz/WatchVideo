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
        
        await _chatRoomRepo.CreateChatRoomAsync();
        return Ok();
    }
    
    
}
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using WatchVideoApi.Dtos;
using WatchVideoApi.Interfaces;

namespace WatchVideoApi.Controllers;

[Controller]
public class UserController : Controller
{
    private readonly IUserRepository _userRepo;

    public UserController(IUserRepository userRepo)
    {
        _userRepo = userRepo;
    }

    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _userRepo.GetUsers();
        if (users == null) return NotFound();
        return  Ok(users);
    }
    
    
    [HttpGet ("d/{id}")]
    public async Task<IActionResult> GetUserById([FromQuery] int id)
    {
        var user = _userRepo.GetUserById(id);
        if (user == null) return NotFound();
        return Ok(user);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUserDto request)
    {
        var userName = request.userName;
        var user = await _userRepo.CreateUser(userName);
        return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, user);
        
    }
}
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using WatchVideoApi.Dtos;
using WatchVideoApi.Interfaces;
using WatchVideoApi.Mappers;
using WatchVideoApi.Models;

namespace WatchVideoApi.Repositories;

public class ChatRoomRepository :  IChatRoomRepository
{
   
    private readonly IRoomStateService _roomStateService;

    public ChatRoomRepository( IRoomStateService roomStateService)
    {
       
        _roomStateService = roomStateService;
    }
    public ChatRoom CreateChatRoom(string roomName)       
    {
       
        var roomState = _roomStateService.CreateRoom(roomName);
        
        var chatRoom = roomState.ToChatRoomFromRoomState();
    
        return chatRoom;  
    }

    public List<ChatRoom> GetAllChatRooms()
    {
        var roomStates =  _roomStateService.GetAllRooms();
        var chatRooms = roomStates.Select(x => x.ToChatRoomFromRoomState()).ToList();
        
        return chatRooms;
    }
    
    public ChatRoom GetChatRoomById(string roomId)
    {
        var chatroom = _roomStateService.GetRoom(roomId).ToChatRoomFromRoomState();
        if (chatroom == null) return null; 
        return chatroom;
    }

    
    
}
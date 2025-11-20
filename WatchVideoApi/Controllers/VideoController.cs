using Microsoft.AspNetCore.Mvc;
using WatchVideoApi.Interfaces;

namespace WatchVideoApi.Controllers;

[ApiController]
[Route("api/video")]
public class VideoController : ControllerBase
{
    private readonly IVideoRepository  _videoRepository;

    public VideoController(IVideoRepository videoRepository)
    {
        _videoRepository = videoRepository;
    }
    [HttpGet]
    public string GetVideoName()
    {
        return _videoRepository.GetVideoName();
    }
}
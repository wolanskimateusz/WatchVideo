using Avalonia.Controls;
using LibVLCSharp.Shared;
namespace WatchVideoDesktop;

public partial class MainWindow : Window
{
    private LibVLC _libVLC;
    private MediaPlayer _mediaPlayer;

    public MainWindow()
    {
        InitializeComponent();

        _libVLC = new LibVLC();
        _mediaPlayer = new MediaPlayer(_libVLC);

        VideoControl.MediaPlayer = _mediaPlayer;

        // WIDEO Z LINKU
        var url = "https://www.youtube.com/embed/gZNK3OyeNr4?si=DQjAc9pcKBlRv43H";

        var media = new Media(_libVLC, url, FromType.FromLocation);
        _mediaPlayer.Play(media);
    }
}

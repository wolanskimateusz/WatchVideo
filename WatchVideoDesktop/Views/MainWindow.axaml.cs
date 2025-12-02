using System;
using Avalonia.Controls;
using LibVLCSharp.Shared;
<<<<<<< Updated upstream
namespace WatchVideoDesktop;

public partial class MainWindow : Window
{
    private LibVLC _libVLC;
    private MediaPlayer _mediaPlayer;

=======

namespace WatchVideoDesktop.Views;

public partial class MainWindow : Window
{
    
    private LibVLC _libVLC;
    private MediaPlayer _mediaPlayer;

    // Link do osadzenia (embed) filmu YouTube. 
    // Zastąp "TWOJ_ID_FILMU" właściwym ID.
    private const string YouTubeLink = "https://www.youtube.com/watch?v=fXA0I6eyW2E";
    
    
>>>>>>> Stashed changes
    public MainWindow()
    {
        InitializeComponent();

<<<<<<< Updated upstream
        _libVLC = new LibVLC();
        _mediaPlayer = new MediaPlayer(_libVLC);

        VideoControl.MediaPlayer = _mediaPlayer;

        // WIDEO Z LINKU
        var url = "https://www.youtube.com/embed/gZNK3OyeNr4?si=DQjAc9pcKBlRv43H";

        var media = new Media(_libVLC, url, FromType.FromLocation);
        _mediaPlayer.Play(media);
=======
        InitializeVLCPlayer();
    }
    
    private void InitializeVLCPlayer()
    {
        string[] options = new string[]
        {
            "--verbose=2",        // Więcej logów, które mogą pomóc w diagnozie
            "--aout=directsound", // Ustawia sterownik audio
            "--vout=directx" ,     // Ustawia sterownik wideo na DirectX (typowy dla Windows)
            
            "--http-caching=3000",
            "--network-caching=3000",
        
            // Debugowanie Lua
            "--lua-config=script-logging=true"
        };
        
        // Utwórz instancję LibVLC
        _libVLC = new LibVLC(options);

        // Utwórz Media Player
        _mediaPlayer = new MediaPlayer(_libVLC);

        // Powiąż odtwarzacz z kontrolką VideoView z XAML
        PlayerView.MediaPlayer = _mediaPlayer;

        // Utwórz obiekt Media z linkiem do YouTube (LibVLC sam obsłuży strumień)
        var media = new Media(_libVLC, YouTubeLink, FromType.FromLocation);

        // Rozpocznij odtwarzanie
        _mediaPlayer.Play(media);
    }

    // WAŻNE: Zwolnienie zasobów przy zamykaniu okna
    protected override void OnClosed(EventArgs e)
    {
        base.OnClosed(e);

        // Zwolnij Media Player, a następnie LibVLC
        _mediaPlayer?.Dispose();
        _libVLC?.Dispose();
>>>>>>> Stashed changes
    }
}

using Avalonia;
<<<<<<< Updated upstream
using LibVLCSharp.Shared;
using WatchVideoDesktop;
=======
using System;
using LibVLCSharp.Shared;

>>>>>>> Stashed changes

internal class Program
{
<<<<<<< Updated upstream
    public static void Main(string[] args)
    {
        // Inicjalizacja biblioteki LibVLC
        Core.Initialize();

        BuildAvaloniaApp()
            .StartWithClassicDesktopLifetime(args);
    }

=======
    // Initialization code. Don't use any Avalonia, third-party APIs or any
    // SynchronizationContext-reliant code before AppMain is called: things aren't initialized
    // yet and stuff might break.
    [STAThread]
    public static void Main(string[] args)
    {
        
        Core.Initialize();
        
        BuildAvaloniaApp()
            .StartWithClassicDesktopLifetime(args);
    }
    
    
    // Avalonia configuration, don't remove; also used by visual designer.
>>>>>>> Stashed changes
    public static AppBuilder BuildAvaloniaApp()
        => AppBuilder.Configure<App>()
            .UsePlatformDetect()
            .LogToTrace();
}

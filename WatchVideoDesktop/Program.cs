using Avalonia;
using LibVLCSharp.Shared;
using WatchVideoDesktop;

internal class Program
{
    public static void Main(string[] args)
    {
        // Inicjalizacja biblioteki LibVLC
        Core.Initialize();

        BuildAvaloniaApp()
            .StartWithClassicDesktopLifetime(args);
    }

    public static AppBuilder BuildAvaloniaApp()
        => AppBuilder.Configure<App>()
            .UsePlatformDetect()
            .LogToTrace();
}

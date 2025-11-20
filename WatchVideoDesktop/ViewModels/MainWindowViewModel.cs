using System.Net.Http;
using System.Threading.Tasks;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using ReactiveUI;

namespace WatchVideoDesktop.ViewModels;

public partial class MainWindowViewModel : ViewModelBase
{
    private readonly HttpClient _httpClient = new HttpClient();

    public MainWindowViewModel()
    {
        LoadDataAsync();
    }
    [ObservableProperty]
    private string data;
    
    [RelayCommand]
    private async Task LoadDataAsync()
    {
        var json = await _httpClient.GetStringAsync("http://localhost:5147/api/video");
        Data = json; // lub deserializacja do obiektu
    }
}
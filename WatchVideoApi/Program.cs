using Microsoft.EntityFrameworkCore;

using WatchVideoApi.Interfaces;
using WatchVideoApi.Repositories;
using WatchVideoApi.Services;

var builder = WebApplication.CreateBuilder(args);

DotNetEnv.Env.Load();

// DataBase


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .SetIsOriginAllowed(_ => true)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddSingleton<IRoomStateService, RoomStateService>();
builder.Services.AddScoped<IChatRoomRepository, ChatRoomRepository>();

builder.Services.AddOpenApi();
builder.Services.AddSignalR();



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

//app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.MapHub<ChatHub>("/chathub").RequireCors("AllowAll");

app.Run();
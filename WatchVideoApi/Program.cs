using Microsoft.EntityFrameworkCore;
using WatchVideoApi.Data;
using WatchVideoApi.Hubs;
using WatchVideoApi.Interfaces;
using WatchVideoApi.Repositories;

var builder = WebApplication.CreateBuilder(args);

DotNetEnv.Env.Load();

// DataBase

var connstring = builder.Configuration.GetConnectionString("DefaultConnection") ??
                       throw new NullReferenceException("No connection string in config!");

string connectionString = connstring
    .Replace("{DB_Host}", Environment.GetEnvironmentVariable("DB_Host")!)
    .Replace("{Database}", Environment.GetEnvironmentVariable("Database")!)
    .Replace("{Username}", Environment.GetEnvironmentVariable("Username")!)
    .Replace("{Password}", Environment.GetEnvironmentVariable("Password")!);

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(connectionString);
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Twój frontend Vite
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddScoped<IVideoRepository, VideoRepository>();

builder.Services.AddOpenApi();
builder.Services.AddSignalR();



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

app.MapHub<ChatHub>("/chathub");

app.Run();
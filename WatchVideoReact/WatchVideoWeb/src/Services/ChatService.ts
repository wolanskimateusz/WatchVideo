import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

export const connection = new HubConnectionBuilder()
    .withUrl("http://localhost:5147/chathub") // Twój backend
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();

    //https://f316bcfe8e04.ngrok-free.app/chathub
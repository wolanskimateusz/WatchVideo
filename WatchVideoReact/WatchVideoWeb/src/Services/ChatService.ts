import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { API_URL} from "../config/api";

export const connection = new HubConnectionBuilder()
    .withUrl(`${API_URL}/chathub`) // Twój backend
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();

    //https://f316bcfe8e04.ngrok-free.app/chathub
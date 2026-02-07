import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { API_URL} from "../config/api";

export const connection = new HubConnectionBuilder()
    .withUrl(`${API_URL}/chathub`)
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();

 
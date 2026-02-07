import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { API_URL} from "../config/api";

export const connection = new HubConnectionBuilder()
    .withUrl(`${API_URL}/chathub?ngrok-skip-browser-warning=true`, {
   headers: {
      "ngrok-skip-browser-warning": "1",
    },
    withCredentials: true,
  })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();

 
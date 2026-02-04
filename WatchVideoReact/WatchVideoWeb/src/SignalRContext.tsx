import { createContext, useContext } from "react";
import { HubConnection } from "@microsoft/signalr";
import { connection } from "./Services/ChatService";


// Tworzymy kontekst przechowujący połączenie
export const SignalRContext = createContext<HubConnection>(connection);

// Hook do łatwego użycia w komponentach
export const useSignalR = (): HubConnection => {
    const context = useContext(SignalRContext);
    if (!context) throw new Error("SignalRContext not provided!");
    return context;
};

import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { calendarService } from "../services/calendar.service";
import { DayEvent } from "../components/market/Calendar/MarketCalendar";

export const useLoginUserId = async (walletAddress: string, username: string) => {
    const data = await calendarService.loginUserId(walletAddress, username);
    return data;
}

export const useLoadEvents = async (Data: string) => {
    const data = await calendarService.loadEvents(Data);
    return data;
}

export const useAddEvent = async (userId: string, Data: DayEvent) => {
    // const fetchAddEvent = useCallback(async () => {
    const data = await calendarService.addEvent(userId, Data);

    return data;
};
export const useDeleteEvent = async (userId:string, eventId: any)=>{
    const data = await calendarService.deleteEvent(userId, eventId);
    return data;
}
export const useEditEvent= async(userId: string, event:DayEvent)=>{
    const data=await calendarService.editEvent(userId, event);
    return data;
}


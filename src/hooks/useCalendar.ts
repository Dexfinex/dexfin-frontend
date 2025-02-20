import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { calendarService } from "../services/calendar.service";
import { DayEvent } from "../components/market/Calendar/MarketCalendar";

export const useLoginUserId = async (walletAddress: string, username: string) => {
    const data = await calendarService.loginUserId(walletAddress, username);
    return data;
}

export const useLoadEvents = async (Data: string) => {
    console.log(Data)
    const data = await calendarService.loadEvents(Data);
    return data;
}

export const useAddEvent = async (accessToken: string, Data: DayEvent) => {
    // const fetchAddEvent = useCallback(async () => {
    const data = await calendarService.addEvent(accessToken, Data);

    return data;
};


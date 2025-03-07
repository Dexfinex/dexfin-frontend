import { calendarService } from "../../../../services/calendar.service";
import { DayEvent } from "../MarketCalendar";

export const getLoadEvents = async (userId: string) => {
    const data = await calendarService.loadEvents(userId);
    return data;
}

export const addEvent = async (userId: string, Data: DayEvent) => {
    const data = await calendarService.addEvent(userId, Data);
    return data;
};
export const deleteEvent = async (userId:string, eventId: any)=>{
    const data = await calendarService.deleteEvent(userId, eventId);
    return data;
}
export const editEvent= async(userId: string, event:DayEvent)=>{
    const data=await calendarService.editEvent(userId, event);
    return data;
}



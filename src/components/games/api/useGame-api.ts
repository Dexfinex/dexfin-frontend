import { GameService } from "../../../services/game.services"
import {GameSession} from "../../GamesModal";

export const saveGameHistory = async (accessToken:string, saveGameSession :GameSession)=>{
    console.log(saveGameSession)
    const data= await GameService.gameHistory(accessToken, saveGameSession);
    return data;
}
export const fetchUserStatistics =async (accessToken:string)=>{
    const data= await GameService.fetchUserStatistics(accessToken);
    return data;
}
export const fetchGameId= async(accessToken: string)=>{
    const data= await GameService.fetchUserGameId(accessToken);
    return data
}

export const fetchTotalUserTokens= async(accessToken: string)=>{
    const data= await GameService.fetchTotalUserTokens(accessToken);
    return data
}
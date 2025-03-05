import {GameSystemApi} from "./api.service";
import {GameSession} from "../components/GamesModal";
export const GameService = {
    gameHistory:async(accessToken:string, saveGameSession: GameSession)=>{
        console.log(saveGameSession)
        try{

            const {data}= await GameSystemApi.post(`/user-games-history`,saveGameSession, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                  }
            })
            return data;
        } catch(error){
            console.error('Error saving Game Session:', {
                error: error instanceof Error ? {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                } : error
            });
        }
    },
    fetchUserStatistics:async(accessToken: string)=>{
        try{
            const {data}= await GameSystemApi.get(`/user-statistics`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                  }
            })
            return data;
        } catch(error){
            console.error('Error saving Game Session:', {
                error: error instanceof Error ? {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                } : error
            });
        }
    },
    fetchTotalUserTokens:async(accessToken: string)=>{
        try{
            const {data}= await GameSystemApi.get(`/tokens`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                  }
            })
            return data;
        } catch(error){
            console.error('Error saving Game Session:', {
                error: error instanceof Error ? {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                } : error
            });
        }
    },
    fetchUserGameId:async(accessToken: string)=>{
        try{
            const {data}= await GameSystemApi.get(`/games`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                  }
            })
            return data;
        } catch(error){
            console.error('Error saving Game Session:', {
                error: error instanceof Error ? {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                } : error
            });
        }
    }
}

import { usernameService } from "../../../services/username.service";
export const checkUsername = async (accessToken: any)=>{
    const data = await usernameService.checkUsername(accessToken);
    return data;
}
export const registerUsername = async (accessToken: string, username: string) => {
    const data = await usernameService.registerUsername(accessToken,username);
    return data;
}
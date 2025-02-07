import axios from "axios";

export const getWalletProfile = async (chatUser:any, address: string) => {
    try {
        const response = await chatUser.profile.info({overrideAccount: address});
        return response
    } catch(err) {
        console.log('err no user', err)
    }
    return null
}

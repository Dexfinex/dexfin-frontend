import axios from "axios";

export const getWalletProfile = async (address: string) => {
    try {
        const info: any = await axios.get(`https://backend.epns.io/apis/v2/users/?caip10=eip155:${address}`)
        return info?.data?.profile || null
    } catch(err) {
        console.log('err')
    }
    return null
}
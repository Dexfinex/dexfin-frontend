export const LIMIT = 20;

export const getWalletProfile = async (chatUser:any, address: string) => {
    try {
        const response = await chatUser.profile.info({overrideAccount: address});
        return response
    } catch(err) {
        console.log('get wallet profile err: ', err)
    }
    
    return null
}

export const getAllChatData = async (chatUser: any) => {
    let page = 1
    let result: any[] = []

    try {
        let list = []
        do {
            list = await chatUser.chat.list('CHATS', {page: page++, limit: LIMIT})
            result = [...result, ...list]
        } while(list.length == LIMIT)

        return result
    } catch(err) {
        console.log('get all chat data: err')
    }

    return []
}
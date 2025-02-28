import { CONSTANTS } from "@pushprotocol/restapi";
import { getStore } from "../store/useStore";
const { setReceivedMessage } = getStore();

export const LIMIT = 20;
export const BIG_IMAGE_WIDHT = "208px";
export const KEY_NAME = "PgpPK";

export const getWalletProfile = async (chatUser: any, address: string) => {
    try {
        const response = await chatUser.profile.info({ overrideAccount: address });
        return response
    } catch (err) {
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
            list = await chatUser.chat.list('CHATS', { page: page++, limit: LIMIT })
            result = [...result, ...list]
        } while (list.length == LIMIT)

        return result
    } catch (err) {
        console.log('get all chat data: err')
    }

    return []
}

let existingStream: any = null; // Global variable to track the stream instance
export const initStream = async (user: any) => {
    let reconnectAttempts = 0;
    let stream: any = null

    const connectStream = async (reconnection: boolean = false) => {
        if (existingStream) {
            console.log('Stream already exists. Skipping reinitialization.');
            return;
        }

        if (reconnection === true) {
            stream = await stream.reinit(
                [
                    CONSTANTS.STREAM.CHAT, // Listen for chat messages
                    CONSTANTS.STREAM.NOTIF, // Listen for notifications
                    CONSTANTS.STREAM.CONNECT, // Listen for connection events
                    CONSTANTS.STREAM.DISCONNECT, // Listen for disconnection events
                ],
                {
                    // Filter options:
                    filter: {
                        // Listen to all channels and chats (default):
                        channels: ['*'],
                        chats: ['*'],

                        // Listen to specific channels and chats:
                        // channels: ['channel-id-1', 'channel-id-2'],
                        // chats: ['chat-id-1', 'chat-id-2'],

                        // Listen to events with a specific recipient:
                        // recipient: '0x...' (replace with recipient wallet address)
                    },
                    // Connection options:
                    connection: {
                        retries: 3, // Retry connection 3 times if it fails
                    },
                    raw: false, // Receive events in structured format
                }
            );
        } else {
            stream = await user.initStream(
                [
                    CONSTANTS.STREAM.CHAT, // Listen for chat messages
                    CONSTANTS.STREAM.NOTIF, // Listen for notifications
                    CONSTANTS.STREAM.CONNECT, // Listen for connection events
                    CONSTANTS.STREAM.DISCONNECT, // Listen for disconnection events
                ],
                {
                    // Filter options:
                    filter: {
                        // Listen to all channels and chats (default):
                        channels: ['*'],
                        chats: ['*'],

                        // Listen to specific channels and chats:
                        // channels: ['channel-id-1', 'channel-id-2'],
                        // chats: ['chat-id-1', 'chat-id-2'],

                        // Listen to events with a specific recipient:
                        // recipient: '0x...' (replace with recipient wallet address)
                    },
                    // Connection options:
                    connection: {
                        retries: 3, // Retry connection 3 times if it fails
                    },
                    raw: false, // Receive events in structured format
                }
            );
        }

        // Stream connection established:
        stream.on(CONSTANTS.STREAM.CONNECT, async (a: any) => {
            console.log('Stream Connected ', a);

            // // Send initial message to PushAI Bot:
            // console.log('Sending message to PushAI Bot');

            // await userAlice.chat.send(pushAIWalletAddress, {
            //   content: 'Hello, from Alice',
            //   type: 'Text',
            // });

            // console.log('Message sent to PushAI Bot');
        });

        stream.on(CONSTANTS.STREAM.CHAT, (message: any) => {
            console.log('Encrypted Message Received');
            console.log(message); // Log the message payload
            setReceivedMessage(message)
        });

        // Setup event handling
        stream.on(CONSTANTS.STREAM.NOTIF, (data: any) => {
            console.log('notify data = ', data);
        });

        // Chat operation received:
        stream.on(CONSTANTS.STREAM.CHAT_OPS, (data: any) => {
            console.log('Chat operation received.');
            console.log(data); // Log the chat operation data
        });

        // Store the instance globally
        existingStream = stream;

        await stream.connect(); // Establish the connection after setting up listeners
        // Stream disconnection:
        stream.on(CONSTANTS.STREAM.DISCONNECT, () => {
            console.log('🚫🚫🚫🚫🚫Stream Disconnected');
            existingStream = null;
            handleReconnection()
        });
    }

    const handleReconnection = () => {
        const delay = 1000;
        console.log(`🔄 Reconnecting in ${delay / 1000}s... (Attempt ${reconnectAttempts + 1})`);

        setTimeout(() => {
            reconnectAttempts++;
            connectStream(true);
        }, delay);
    };

    connectStream()
}
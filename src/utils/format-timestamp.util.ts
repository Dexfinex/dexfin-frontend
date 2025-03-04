export const formatTimeAgo = (timestamp: string): string => {
    const timestampNum = parseInt(timestamp);
    const now = Math.floor(Date.now() / 1000);
    const seconds = now - timestampNum;

    if (seconds < 60) {
        return 'just now';
    } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        return `${minutes}min ago`;
    } else if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600);
        return `${hours}h ago`;
    } else {
        const days = Math.floor(seconds / 86400);
        return `${days}d ago`;
    }
};

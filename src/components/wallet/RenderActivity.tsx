import React from "react";

import { useStore } from "../../store/useStore";
import { mapChainName2ExplorerUrl } from "../../config/networks";
import useActivitiesStore from "../../store/useActivitiesStore.ts";

import { shrinkAddress, getTimeAgo } from "../../utils/common.util";

const RenderActivity: React.FC = () => {
    const { theme } = useStore();
    const { activities } = useActivitiesStore();

    return (
        <div className="space-y-3 flex-1 mt-4 sm:mt-5 mx-4 overflow-y-auto ai-chat-scrollbar sm:max-h-[calc(100vh-350px)] max-h-[calc(100vh-290px)]">
            {
                activities.length === 0 && <div className='w-full h-full flex justify-center items-center align-center mt-20'><h2 className='text-white/60 italic'>No activities yet</h2></div>
            }
            {
                activities.length > 0 && activities.map((activity, index) => (
                    <a key={activity.hash + index} className={`p-3 flex items-center justify-between ${theme === "dark" ? "bg-white/5 hover:bg-white/10" : "bg-black/5 hover:bg-black/10"} rounded-lg gap-2`}
                        href={`${mapChainName2ExplorerUrl[activity.network.id]}/tx/${activity.hash}`}
                        target="_blank">
                        <div className="flex items-center gap-2">
                            <img src={activity.network.icon} className="w-6 h-6 rounded-full" />
                            <div>
                                <div className={`text-sm ${theme === "dark" ? "text-white/70" : "text-black/70"}`}>{activity.summary}</div>
                                <div className={`text-xs ${theme === "dark" ? "text-white/70" : "text-black/70"}`}>{shrinkAddress(activity.hash)}</div>
                            </div>
                        </div>
                        <span className={`text-sm ${theme === "dark" ? "text-white/70" : "text-black/70"} `}>{getTimeAgo(activity.date)}</span>
                    </a>
                ))
            }
        </div>
    )
}

export default RenderActivity;
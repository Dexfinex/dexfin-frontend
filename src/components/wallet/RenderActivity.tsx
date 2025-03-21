import React, { useContext } from "react";
import { ExternalLink } from "lucide-react";
import { useStore } from "../../store/useStore";
import { mapChainName2ExplorerUrl } from "../../config/networks";
import useActivitiesStore from "../../store/useActivitiesStore.ts";
import { shrinkAddress, getTimeAgo } from "../../utils/common.util";
import { TokenChainIcon } from "../swap/components/TokenIcon.tsx";
import { useActivities } from "../../hooks/useActivities.ts";
import { Web3AuthContext } from "../../providers/Web3AuthContext.tsx";
import { Skeleton } from "@chakra-ui/react";

const RenderActivity: React.FC = () => {
    const { theme } = useStore();
    const { address, solanaWalletInfo } = useContext(Web3AuthContext);
    const { isLoading } = useActivities({ evmAddress: address, solanaAddress: solanaWalletInfo?.publicKey || "" })
    const { activities } = useActivitiesStore();

    return (
        <>
            {
                isLoading ? <div className="w-full px-4 mt-4 sm:mt-5"><Skeleton className="h-16 rounded-lg" /></div> :
                    <div className="space-y-3 flex-1 mt-4 sm:mt-5 mx-4 overflow-y-auto ai-chat-scrollbar sm:max-h-[calc(100vh-360px)] max-h-[calc(100vh-296px)]">
                        {
                            activities.length === 0 && <div className='w-full h-full flex justify-center items-center align-center mt-20'><h2 className='text-white/60 italic'>No activities yet</h2></div>
                        }
                        {
                            activities.length > 0 && activities.map((activity, index) => (
                                <a key={activity.hash + index} className={`p-3 flex items-center justify-between ${theme === "dark" ? "bg-white/5 hover:bg-white/10" : "bg-black/5 hover:bg-black/10"} rounded-lg gap-2`}
                                    href={`${mapChainName2ExplorerUrl[activity.network.id]}/tx/${activity.hash}`}
                                    target="_blank">
                                    <div className="flex items-center gap-2 max-w-[248px]">
                                        {
                                            activity.tokenLogo ?
                                                <TokenChainIcon src={activity.tokenLogo} alt={""} size={"md"}
                                                    chainId={Number(activity.network.chainId)} />
                                                :
                                                <img src={activity.network.icon} className="w-6 h-6 rounded-full" />
                                        }
                                        <div className="flex-1">
                                            <div className={`text-sm ${theme === "dark" ? "text-white/70" : "text-black/70"}`}>{activity.summary}</div>
                                            <div className={`flex items-center gap-2 text-xs ${theme === "dark" ? "text-white/70" : "text-black/70"}`}>
                                                {shrinkAddress(activity.hash)}
                                                <ExternalLink className="w-4 h-4 text-white/70" />
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`text-sm ${theme === "dark" ? "text-white/70" : "text-black/70"} `}>{getTimeAgo(activity.date)}</span>
                                </a>
                            ))
                        }
                    </div>
            }
        </>
    )
}

export default RenderActivity;
import {Send, X} from "lucide-react";
import React from "react";
import {Chart, ChartProps} from "./Chart.tsx";

type ChartDrawerProps = ChartProps & {
    isOpen: boolean;
    setOpen: (isOpen: boolean) => void;
}

export const ChartDrawer: React.FC<ChartDrawerProps> = ({
                                                            isOpen,
                                                            setOpen,
                                                            type,
                                                            onTypeChange,
                                                            isMaximized,
                                                            token
                                                        }) => {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100001] flex items-end justify-center w-full">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)}/>
            <div
                className={`relative glass border border-white/10 shadow-lg transition-all duration-300 ease-in-out w-full rounded-xl`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <Send className="w-5 h-5"/>
                        <h2 className="text-xl font-semibold">Chart</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setOpen(false)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4"/>
                        </button>
                    </div>
                </div>
                <div style={{height: "65vh"}}>
                    <Chart
                        type={type}
                        onTypeChange={onTypeChange}
                        isMaximized={isMaximized}
                        token={token}
                    />
                </div>
            </div>
        </div>
    );
}
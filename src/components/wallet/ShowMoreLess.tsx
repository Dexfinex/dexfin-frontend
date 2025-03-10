import React, { useState } from "react"

import { useStore } from "../../store/useStore";

const ShowMoreLess: React.FC<{ text: string, maxLength: number }> = ({ text, maxLength = 100 }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { theme } = useStore();

    const toggleExpand = () => setIsExpanded(!isExpanded);

    return (
        <div className={`${theme === "dark" ? "text-white/70" : "text-black/70"}`}>
            <p className="text-sm sm:text-md">
                {isExpanded ? text : text.slice(0, maxLength) + (text.length > maxLength ? "..." : "")}
            </p>
            {text.length > maxLength && (
                <button
                    onClick={toggleExpand}
                    className="text-blue-500 hover:text-blue-600 mt-1 text-sm sm:text-md"
                >
                    {isExpanded ? "Show Less" : "Show More"}
                </button>
            )}
        </div>
    );
}

export default ShowMoreLess;
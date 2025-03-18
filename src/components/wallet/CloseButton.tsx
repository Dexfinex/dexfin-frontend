import React from "react";

interface CloseButtonProps {
    setIsOpen: (isOpen: boolean) => void

}
const CloseButton: React.FC<CloseButtonProps> = ({ setIsOpen }) => {
    return (<div onClick={() => setIsOpen(false)} className="absolute top-0 bottom-0 left-[-40px] w-[40px] pt-4 cursor-pointer flex justify-evenly h-[98%] m-auto rounded-2xl
    hover:bg-white/10 hover:text-gray-500 hover:h-[94%] transition-all duration-300 ease-in-out">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="13 17 18 12 13 7"></polyline>
            <polyline points="6 17 11 12 6 7"></polyline>
        </svg>
    </div>)
}

export default CloseButton;
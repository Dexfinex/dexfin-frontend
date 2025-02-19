import React, { useState } from "react";
import { Skeleton } from "@chakra-ui/react";

export const ImageWithSkeleton: React.FC<{ src: string, width: string }> = ({ src, width }) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <>
            {/* Skeleton Loader */}
            {isLoading && (
                <Skeleton style={{ width, height: width }} />
            )}
            {/* Actual Image */}
            <img
                style={{ width, height: 'auto' }}
                src={src}
                onLoad={() => setIsLoading(false)}
            />
        </>
    );
};
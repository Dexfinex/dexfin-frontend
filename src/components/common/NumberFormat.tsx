import React from "react";

import { formatNumberByRepeat } from "../../utils/common.util";

interface NumberFormatProps {
    number: number;
    prefix?: string;
    suffix?: string;
}

/**
 * @number number to show
 * @prefix prefix value ex: $
 * @suffix suffix value ex: %
 **/

const NumberFormat: React.FC<NumberFormatProps> = ({ number, prefix = "", suffix }) => {
    /**
     * @prev first string
     * @current second string
     * @next last string
     * */
    const { prev, current, next } = formatNumberByRepeat(number);
    return (
        <span className="">
            {prefix}
            {prev}
            {
                current && <span style={{ fontSize: "70%" }}>({current})</span>
            }
            {next}
            {suffix}
        </span>
    )
}

export default NumberFormat;
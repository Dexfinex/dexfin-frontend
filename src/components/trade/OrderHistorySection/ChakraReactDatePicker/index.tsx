import {HTMLAttributes, forwardRef} from "react";
import DatePicker from "react-datepicker";
// import { useColorMode } from "@chakra-ui/react";
import {InputGroup, Input, InputRightElement} from "@chakra-ui/react";
import {CalendarIcon} from "@chakra-ui/icons";

import "react-datepicker/dist/react-datepicker.css";
// import "./style.scss";
import styled from "styled-components";

const StyledInput = styled.input`
    width: 120px;
    height: var(--input-height);
    font-size: var(--input-font-size);
    -webkit-padding-end: var(--input-height);
    padding-inline-end: var(--input-height);
    border-radius: var(--input-border-radius);
    min-width: 0px;
    outline-offset: 2px;
    position: relative;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    transition-property: var(--chakra-transition-property-common);
    transition-duration: var(--chakra-transition-duration-normal);
    --input-font-size: var(--chakra-fontSizes-md);
    --input-padding: var(--chakra-space-4);
    --input-border-radius: var(--chakra-radii-md);
    --input-height: var(--chakra-sizes-10);
    border: 1px solid;
    outline: none;
    box-shadow: none;
    color: #ddd;
    background: #141414;
    border-color: #1b1b1b;

    &:focus {
        border-color: #444;
    }
`


const customDateInput = ({value, onClick, onChange}: any, ref: any) => (
/*
    <Input
        autoComplete="off"
        background="white"
        value={value}
        ref={ref}
        onClick={onClick}
        onChange={onChange}
    />
*/
    <StyledInput
        placeholder=''
        autoComplete="off"
        value={value}
        ref={ref}
        onClick={onClick}
        onChange={onChange}
    />
);
customDateInput.displayName = "DateInput";

const CustomInput = forwardRef(customDateInput);

const icon = <CalendarIcon fontSize="sm"/>;

interface Props {
    isClearable?: boolean;
    onChange: (date: Date) => any;
    selectedDate: Date | undefined;
    showPopperArrow?: boolean;
}

const ChakraReactDatePicker = ({selectedDate, onChange, ...props}: Props) => {
    return (
        <>
            <InputGroup className="dark-theme chakra-date-picker" style={{
                width: 'fit-content'
            }}>
                <DatePicker
                    selected={selectedDate}
                    onChange={onChange}
                    className="react-datapicker__input-text"
                    customInput={<CustomInput/>}
                    dateFormat="MM/dd/yyyy"
                    {...props}
                />
                <InputRightElement color="gray.500">
                    {
                        icon
                    }
                </InputRightElement>
            </InputGroup>
        </>
    );
};

export default ChakraReactDatePicker;

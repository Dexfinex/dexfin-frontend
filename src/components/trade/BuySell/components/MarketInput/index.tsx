import styled from 'styled-components';
import {
    Text,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Input
} from '@chakra-ui/react'

export interface IMarketInputProps {
    hasLeftElement?: boolean,
    hasUnit?: boolean,
    unitName?: string,
    isInvalid?: boolean,
    invalidText?: string,
    label?: string,
    value: number,
    disabled?: boolean,
    setValue: (value: number) => void
    onFocus?: () => void
}

const errorColor = '#ff4952'


const StyledInput = styled.input`

    width: 100%;
    height: var(--input-height);
    font-size: var(--input-font-size);
    -webkit-padding-start: var(--input-height);
    padding-inline-start: var(--input-height);
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
    border-color: transparent;

    &:focus {
        border-color: #444 !important;
    }
`

const MarketInput = ({
                         disabled = false,
                         hasLeftElement,
                         hasUnit,
                         isInvalid,
                         invalidText,
                         unitName,
                         label,
                         value,
                         setValue,
                         onFocus
                     }: IMarketInputProps) => {

    return (
        <div style={{
            marginTop: '10px'
        }}>
            {
                label && (
                    <div style={{
                        position: "relative",
                        height: '1.5rem'
                    }}>
              <span style={{
                  left: '0',
                  position: 'absolute',
                  fontSize: '14px'
              }}>{label}</span>
                        {
                            isInvalid && (
                                <span style={{
                                    right: '0',
                                    position: 'absolute',
                                    color: errorColor
                                }}>
                                    {invalidText}
                                </span>
                            )
                        }
                    </div>
                )
            }
            <InputGroup>
                {
                    hasLeftElement && (
                        <InputLeftElement pointerEvents='none'>
                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="approx" width="24" height="24"
                                 viewBox="0 0 24 24" fill="#666">
                                <path
                                    d="M18.9 9.2C18.1 10.1 16.6 11 15 11C13.5 11 12.6 10.5 11.8 10.1C11 9.8 10.2 9.3 8.9 9.3C7.7 9.3 6.6 10 6 10.6L5 9.1C5.9 8.2 7.3 7.2 8.9 7.2C10.4 7.2 11.3 7.8 12.1 8.1C12.9 8.4 13.7 9 15 9C16.2 9 17.3 8.2 17.9 7.6L18.9 9.2M19 14.1C18.1 15 16.7 16 15.1 16C13.6 16 12.7 15.5 11.9 15.1C11.1 14.8 10.3 14.2 9 14.2C7.8 14.2 6.7 15 6.1 15.6L5.1 14C6 13.1 7.4 12.1 9 12.1C10.5 12.1 11.4 12.6 12.2 13C13 13.3 13.8 13.8 15.1 13.8C16.3 13.8 17.4 13 18 12.4L19 14.1Z"></path>
                            </svg>
                        </InputLeftElement>
                    )
                }
                {
                    hasUnit && (
                        <InputRightElement
                            className="market-input-right-element"
                            pointerEvents='none' style={{
                            paddingRight: '8px',
                            color: isInvalid ? errorColor : '#999'
                        }}>
                            {unitName}
                        </InputRightElement>
                    )
                }
                <StyledInput
                    onFocus={onFocus}
                    disabled={disabled}
                    className={hasLeftElement ? '' : 'normal-input'}
                    type='number'
                    placeholder=''
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value)
                    }}
                    style={isInvalid ? {
                        borderColor: errorColor
                    } : {}}
                />
            </InputGroup>
        </div>
    );
}


export interface ICustomizedInputProps {
    hasRightElement?: boolean,
    rightElement?: any,
    value: number,
    placeholder: string,
    setValue: (value: number) => void
}


export const CustomizedInput = ({
                                    hasRightElement,
                                    rightElement,
                                    placeholder,
                                    value,
                                    setValue
                                }: ICustomizedInputProps) => {

    return (
        <InputGroup>
            {
                hasRightElement && (
                    <InputRightElement
                        className="market-input-right-element"
                        pointerEvents='none' style={{
                        paddingRight: '8px',
                    }}>
                        {rightElement}
                    </InputRightElement>
                )
            }
            <StyledInput
                className={'normal-input'}
                placeholder={placeholder}
                value={value}
                onChange={(e) => {
                    setValue(e.target.value)
                }}
                style={{
                    borderColor: '#333'
                }}
            />
        </InputGroup>
    );
}

export default MarketInput;

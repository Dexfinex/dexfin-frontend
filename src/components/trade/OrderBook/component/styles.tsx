import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    justify-content: space-around;
    color: #98a6af;
    padding: .3em;
    font-size: 14px;
    background-color: #141414;
    
    span:first-child {
        width: 40%;
    }
    
    span:nth-child(2) {
        width: calc(25% - 1rem);
    }
    
    span:nth-child(3) {
        width: 25%;
        text-align: right;
        padding-right: 1rem;
    }
    
    span:nth-child(4) {
        width: calc(10% + 1rem);
    }
    
`

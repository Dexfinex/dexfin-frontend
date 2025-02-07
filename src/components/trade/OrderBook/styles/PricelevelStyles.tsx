import styled from "styled-components";

interface ContainerProps {
  isRight: boolean;
  windowWidth: number;
}

export const Container = styled.div<ContainerProps>`
  display: flex;
  justify-content: space-around;
  position: relative;
  font-size: 14px;
  color: #aaa;
  
  &:after {
    background-color: ${props => props.isRight ? 'rgba(25,189,133,0.76)' : 'rgba(253,66,69,0.75)'};
    background-position: center;
    height: 100%;
    padding: .3em 0;
    display: block;
    content: "";
    position: absolute;
    left: 0;
    right: unset;
    z-index: 0;

    @media only screen and (min-width: 800px) {
      //left: 0;
      //right: unset;
      left: ${props => props.isRight ? 'unset' : 0};
      right: ${props => props.isRight ? 0 : 'unset'};
    }
  }
  
  span {
    z-index: 1;
    min-width: 54px;
  }
  
  .price {
    color: ${props => props.isRight ? '#179981' : '#f03349'}
  }
`

export const PriceLevelRowContainer = styled.div`
  //margin: .155em 0;
`

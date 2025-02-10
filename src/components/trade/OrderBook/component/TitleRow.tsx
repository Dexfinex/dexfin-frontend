import {FunctionComponent} from 'react';
import {Container} from "./styles";

interface TitleRowProps {
    reversedFieldsOrder?: boolean;
    windowWidth: number;
}

const TitleRow: FunctionComponent<TitleRowProps> = ({reversedFieldsOrder = false, windowWidth}) => {
    return (
        <Container data-testid='title-row' className='title-row'>
            <span>PRICE</span>
            <span>SIZE</span>
            <span>TOTAL</span>
            <span>EXC</span>
            {/*
      {reversedFieldsOrder || windowWidth < MOBILE_WIDTH ?
        <>
          <span>PRICE</span>
          <span>SIZE</span>
          <span>TOTAL</span>
        </> :
        <>
          <span>TOTAL</span>
          <span>SIZE</span>
          <span>PRICE</span>
        </>}
*/}
        </Container>
    );
};

export default TitleRow;

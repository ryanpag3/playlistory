import React from 'react'
import styled from 'styled-components';
import NavBar from '../../components/NavBar';
import Screen from '../../components/Screen'
import colors from '../../constants/colors';

const Error = (props: any) => {
    return (
        <Container>
            <NavBar/>
            <ErrorContainer>
                <ErrorMsg>
                    {props.children || `A network error occured. Please try again later!`}
                </ErrorMsg>
            </ErrorContainer>
        </Container>
    )
}

const Container = styled(Screen)`
    display: flex;
    align-items: center;
`;

const ErrorContainer = styled.div`
    max-width: 25em;
    text-align: center;
`;

const ErrorMsg = styled.h1`
    color: ${colors.LIGHT};
    font-weight: normal;
`;

export default Error;

import React from 'react'
import styled from 'styled-components';
import colors from '../constants/colors';

const Screen = (props: any) => {
    return (
        <Container {...props}>
            {props.children}
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100vh;
    height: 100%;
    background-color: ${colors.DARK};
`;

export default Screen;

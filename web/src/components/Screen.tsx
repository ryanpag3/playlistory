import React from 'react'
import styled from 'styled-components';

const Screen = (props: any) => {
    return (
        <Container {...props}>
            {props.children}
        </Container>
    )
}

const Container = styled.div`
    width: 100%;
    height: 100%;
    background-color: #393e46;
`;

export default Screen

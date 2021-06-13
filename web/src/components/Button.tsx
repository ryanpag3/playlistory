import React, { Fragment } from 'react'
import styled from 'styled-components';

const Button = (props: any) => {
    return (
        <Fragment>
            <StyledButton {...props}>
                {props.children}
            </StyledButton>
        </Fragment>
    )
}

const StyledButton = styled.button`
    font-size: 16px;
    padding: 12px;
    border-radius: 25px;
    border: none;
`;

export default Button

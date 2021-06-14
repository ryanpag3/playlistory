import React, { Fragment } from 'react'
import styled from 'styled-components';
import { Button as MaterialButton } from '@material-ui/core';
import colors from '../constants/colors';

const Button = (props: any) => {
    return (
        <Fragment>
            <StyledButton {...props}
                variant="contained"
            >
                {props.children}
            </StyledButton>
        </Fragment>
    )
}

const StyledButton = styled(MaterialButton)`
    font-size: 16px;
    padding: 8px;
    padding-top: 12px;
    border-radius: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
        /* background-color: ${colors.DARK} */
    }
    /* border: none; */
`;

export default Button

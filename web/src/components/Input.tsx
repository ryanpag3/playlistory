import React, { Fragment } from 'react'
import styled from 'styled-components';
import { TextField } from '@material-ui/core';
import colors from '../constants/colors';

const Input = (props: {
    type?: string;
    placeholder?: string;
    onChange?: (e: any) => void;
}) => {
    return (
        <Fragment>
            <StyledInput {...props } label={props.placeholder}/>
        </Fragment>
    )
}

const StyledInput = styled(TextField)`
    border: none;
    /* border-radius: 20px; */
    font-size: 16px;

    .MuiInput-root {
        color: white;
    }

    .MuiInput-underline {
        border-bottom: 2px solid white;
    }
`;

export default Input;

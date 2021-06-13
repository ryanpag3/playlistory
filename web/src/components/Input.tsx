import React, { Fragment } from 'react'
import styled from 'styled-components';
import colors from '../constants/colors';

const Input = (props: {
    type?: string;
    placeholder?: string;
    onChange?: (e: any) => void;
}) => {
    return (
        <Fragment>
            <StyledInput {...props }/>
        </Fragment>
    )
}

const StyledInput = styled.input`
    border: none;
    border-radius: 20px;
    font-size: 16px;
    padding: 8px;
    padding-left: 12px;
    color: ${colors.DARK};
    outline: none;
`;

export default Input;

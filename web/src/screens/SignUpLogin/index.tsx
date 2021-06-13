import React from 'react'
import styled from 'styled-components';
import Screen from '../../components/Screen';
import SignUpLoginForm from './SignUpLoginForm';

const SignUpLogin = (props: {
    formType?: string;
}) => {
    return (
        <StyledScreen>
            <SignUpLoginForm { ...props }/>
        </StyledScreen>
    )
}

const StyledScreen = styled(Screen)`
    align-items: center;
    justify-content: center;
`;

export default SignUpLogin

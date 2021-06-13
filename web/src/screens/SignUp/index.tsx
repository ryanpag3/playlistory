import React from 'react'
import styled from 'styled-components';

import Screen from '../../components/Screen';
import SignUpForm from './SignUpForm';

const SignUp = () => {
    return (
        <StyledScreen>
            <SignUpForm/>
        </StyledScreen>
    )
}

const StyledScreen = styled(Screen)`
    align-items: center;
    justify-content: center;
`;

export default SignUp

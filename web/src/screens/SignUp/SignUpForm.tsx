import React from 'react'
import styled from 'styled-components';
import Input from '../../components/Input';
import colors from '../../constants/colors';

const SignUpForm = () => {
    return (
        <Container>
            <TitleContainer>
                <Title>Playlistory</Title>
            </TitleContainer>
            <EmailInput
                placeholder="email"
                onChange={(t) => {
                    console.log(t);
                }}
            />
            <EmailInput
                placeholder="email"
                onChange={(t) => {
                    console.log(t);
                }}
            />
            <EmailInput
                placeholder="email"
                onChange={(t) => {
                    console.log(t);
                }}
            />
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${colors.PRIMARY_ACCENT};
    width: 300px;
    height: 350px;
    border-radius: 30px;
    align-items: center;
`;

const TitleContainer = styled.div`

`;

const Title = styled.h1`
    color: ${colors.LIGHT};
    font-size: 2.5em;
`;

const EmailInput = styled(Input)`

`;

const ConfirmEmailInput = styled(Input)`

`;

const PasswordInput = styled(Input)`

`;

export default SignUpForm

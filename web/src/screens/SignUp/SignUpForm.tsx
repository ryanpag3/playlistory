import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import Input from '../../components/Input';
import colors from '../../constants/colors';

const SignUpForm = () => {
    const [email, setEmail] = useState();
    const [confirmEmail, setConfirmEmail] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        console.log('fuck')
        if (email !== confirmEmail) {
            setError('Emails must match.' as any);
        } else {
            setError(undefined as any);
        }
    }, [ email, confirmEmail ]);

    return (
        <Container>
            <TitleContainer>
                <Title>Playlistory</Title>
            </TitleContainer>
            <EmailInput
                placeholder="email"
                onChange={(t) => {
                    setEmail(t.target.value);
                }}
            />
            <ConfirmEmailInput
                placeholder="confirm email"
                onChange={(t) => setConfirmEmail(t.target.value)}
            />
            <PasswordInput
                placeholder="password"
                onChange={(t) => setPassword(t.target.value)}
                type="password"
            />
            <SubmitContainer>
                <SubmitButton>
                    Submit
                </SubmitButton>
                <LoginAnchor>
                    Login
                </LoginAnchor>
            </SubmitContainer>
            {
                error &&
                <ErrorMsg>{error}</ErrorMsg>
            }
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${colors.PRIMARY_ACCENT};
    width: 300px;
    height: 375px;
    border-radius: 30px;
    align-items: center;
`;

const TitleContainer = styled.div`

`;

const Title = styled.h1`
    color: ${colors.LIGHT};
    font-size: 2.5em;
    margin-bottom: .5em;
`;

const StyledInput = styled(Input)`
    margin-top: 10px;
`;

const EmailInput = styled(StyledInput)`

`;

const ConfirmEmailInput = styled(StyledInput)`

`;

const PasswordInput = styled(StyledInput)`

`;

const SubmitContainer = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
`;

const SubmitButton = styled.button`
    margin-top: 20px;
    font-size: 16px;
    padding: 8px;
    border-radius: 10px;
    border: none;
    background-color: ${colors.SECONDARY_ACCENT};
    min-width: 100px;
`;

const LoginAnchor = styled.a`
    margin-top: 20px;
`;

const ErrorMsg = styled.h2`
    color: red;
`;

export default SignUpForm

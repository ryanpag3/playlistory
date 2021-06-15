import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../components/Button';
import Input from '../../components/Input';
import colors from '../../constants/colors';

const SignUpLoginForm = (props: {
    formType?: string;
}) => {
    const history = useHistory();
    const [formType, setFormType] = useState(props.formType || 'sign-up');
    const [email, setEmail] = useState();
    const [confirmEmail, setConfirmEmail] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState(undefined as any);

    useEffect(() => {
        if (email !== confirmEmail && (email && confirmEmail)) {
            setError('Emails must match.' as any);
        } else {
            setError(undefined as any);
        }
    }, [email, confirmEmail]);

    async function submit() {
        if (formType === 'sign-up') {
            return submitSignUp();
        } else {
            return submitLogin();
        }
    }

    async function submitSignUp() {
        try {
            if (!email) {
                return setError(`Email is a required field.`);
            } else if (!confirmEmail) {
                return setError(`Email confirmation is a required field.`);
            } else if (!password) {
                return setError(`Password is a required field.`);
            }

            const res = await axios.post('/user', {
                email,
                password
            });

            if (res.status === 200) {
                console.log('success');
            }
        } catch (e) {
            if (e.response.status === 409) {
                return setError(`Email already in use.`);
            }
        }
    }

    async function submitLogin() {
        try {
            if (!email) {
                return setError(`Email is a required field.`);
            } else if (!password) {
                return setError(`Password is a required field.`);
            }

            const res = await axios.post('/sign-in', {
                email,
                password
            });

            if (res.status === 200) {
                console.log('we gucci');
                history.push('/');
            }
        } catch (e) {
            if (e.response.status === 409) {
                return setError(`Email already in use.`);
            }
            console.error(e);
        }
    }

    function toggleFormType() {
        if (formType === 'sign-up') {
            setFormType('login');
        } else {
            setFormType('sign-up');
        }
    }

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
            {
                formType === 'sign-up' &&
                <ConfirmEmailInput
                    placeholder="email... again"
                    onChange={(t) => setConfirmEmail(t.target.value)}
                />
            }
            <PasswordInput
                placeholder="password"
                onChange={(t) => setPassword(t.target.value)}
                type="password"
            />
            <SubmitContainer>
                <SubmitButton
                    onClick={submit}
                >
                    {formType === 'sign-up' ? `Sign Up` : `Login`}
                </SubmitButton>
                <LoginAnchor
                    onClick={toggleFormType}
                >
                    {formType === 'sign-up' ? `Login Instead` : `Sign-In Instead`}
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
    width: 80%;
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

const SubmitButton = styled(Button)`
    margin-top: 20px;
    background-color: ${colors.SECONDARY_ACCENT};
    min-width: 125px;
`;

const LoginAnchor = styled.a`
    margin-top: 20px;
    margin-bottom: 20px;
    font-size: 16px;
`;

const ErrorMsg = styled.div`
    color: ${colors.ERROR_RED};
    font-weight: bold;
    margin-bottom: 10px;
    font-size: 14px;
`;

export default SignUpLoginForm

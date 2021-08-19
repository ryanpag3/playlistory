import axios from '../../util/axios';
import React, { useState } from 'react'
import styled from 'styled-components';
import Button from '../../components/Button';
import InnerContainer from '../../components/InnerContainer';
import NavBar from '../../components/NavBar';
import Screen from '../../components/Screen';
import colors from '../../constants/colors';
import UpdateEmailSetting from './UpdateEmailSetting';
import { useHistory } from 'react-router-dom';

const Settings = () => {
    const history = useHistory();
    const [email, setEmail] = useState();

    async function submit() {
        try {
            await submitEmail();
        } catch (e) {
            console.log(e);
        }
    }

    async function submitEmail() {
        try {
            await axios({
                method: 'PUT',
                url: '/user/email',
                data: {
                    email
                }
            });
        } catch (e) {
            history.replace('/error');
        }
    }

    return (
        <Container>
            <NavBar />
            <SettingsContainer>
                <UpdateEmailSetting
                    setEmail={(email: any) => setEmail(email)}
                />
                <SaveButtonCont>
                    <SaveButton
                        onClick={submit}
                    >Save</SaveButton>
                </SaveButtonCont>
            </SettingsContainer>
        </Container>
    )
}

const Container = styled(Screen)`
    align-items: center;
`;

const SettingsContainer = styled(InnerContainer)`
    background-color: transparent;
`;

const SaveButtonCont = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 3em;
`;

const SaveButton = styled(Button)`
    padding: .75em 2.5em .5em 2.5em;
    font-weight: bold;
    background-color: ${colors.MEDIUM};
`;

export default Settings

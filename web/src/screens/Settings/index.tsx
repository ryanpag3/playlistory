import React from 'react'
import styled from 'styled-components';
import InnerContainer from '../../components/InnerContainer';
import NavBar from '../../components/NavBar';
import Screen from '../../components/Screen';
import UpdateEmailSetting from './UpdateEmailSetting';

const Settings = () => {
    return (
        <Container>
            <NavBar/>
            <SettingsContainer>
                <UpdateEmailSetting/>
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

export default Settings

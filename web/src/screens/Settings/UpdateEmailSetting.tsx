import React from 'react'
import styled from 'styled-components';
import SettingHeader from './SettingHeader';

const UpdateEmailSetting = () => {
    return (
        <Container>
            <SettingHeader
                title="Update Email"
                description="Placeholder description."
            />
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

export default UpdateEmailSetting

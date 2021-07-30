import React from 'react'
import styled from 'styled-components';
import SettingDescription from './SettingDescription';
import SettingTitle from './SettingTitle';

const SettingHeader = (props: any) => {
    return (
        <Container>
            <SettingTitle>{props.title}</SettingTitle>
            <SettingDescription>{props.description}</SettingDescription>
        </Container>
    )
}

const Container = styled.div``;

export default SettingHeader

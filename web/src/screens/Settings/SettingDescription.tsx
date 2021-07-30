import React from 'react'
import styled from 'styled-components';
import colors from '../../constants/colors';

const SettingDescription = (props: any) => {
    return (
        <Container>
            <SettingDescriptionText>{props.children}</SettingDescriptionText>
        </Container>
    )
}

const Container = styled.div`

`;

const SettingDescriptionText = styled.span`
    color: ${colors.LIGHT};
`;

export default SettingDescription

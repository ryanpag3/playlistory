import React from 'react'
import styled from 'styled-components';
import colors from '../../constants/colors';


const SettingTitle = (props: any) => {
    return (
        <Container>
            <SettingTitleText>{props.children}</SettingTitleText>
        </Container>
    )
}

const Container = styled.div`

`;

const SettingTitleText = styled.h2`
    color: ${colors.LIGHT};
`;

export default SettingTitle;

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
    font-size: 1.25em;
    margin-bottom: .5em;
    color: ${colors.LIGHT};
`;

export default SettingTitle;

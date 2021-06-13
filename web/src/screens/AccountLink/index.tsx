import React from 'react'
import styled from 'styled-components'
import Screen from '../../components/Screen';
import colors from '../../constants/colors';
import AccountBox from './AccountBox';

const AccountLink = () => {
    const Boxes = [
        {
            platformName: 'Spotify',
            onClick: () => {

            }
        }
    ]

    return (
        <StyledScreen>
            <InfoContainer>
                <PageTitle>Link Accounts</PageTitle>
                <PageDescription>You must link a music account to use Playlistory.</PageDescription>
            </InfoContainer>
            <AccountBoxContainer>
                {
                    Boxes.map(b => <AccountBox { ...b }/>)
                }
            </AccountBoxContainer>
        </StyledScreen>
    )
}

const StyledScreen = styled(Screen)`
    align-items: center;
`;

const InfoContainer = styled.div`
    align-items: center;
    color: ${colors.LIGHT};
`;

const PageTitle = styled.h1`
    font-size: 4em;
    font-weight: normal;
    margin-bottom: 15px;
    text-align: center;
`;

const PageDescription = styled.div`
    text-align: center;
`;

const AccountBoxContainer = styled.div`
    display: flex;
`;

export default AccountLink

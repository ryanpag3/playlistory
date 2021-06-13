import React, { useState } from 'react'
import { FaSpotify } from 'react-icons/fa';
import styled from 'styled-components';
import Button from '../../components/Button';
import colors from '../../constants/colors';

const AccountBox = (props: {
    platformName: string;
    onClick: () => void;
}) => {
    const [isLinked, setIsLinked] = useState(false);

    function Icon() {
        switch(props.platformName.toLowerCase()) {
            case 'spotify':
                return <SpotifyIcon/>;
            default:
                return null;
        }
    }

    return (
        <Container>
            <Icon/>
            <PlatformName>
                {props.platformName}
            </PlatformName>
            <LinkingButton>
                { isLinked ? `Unlink` : `Link` }
            </LinkingButton>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${colors.LIGHT};
`;

const SpotifyIcon = styled(FaSpotify)`

`;

const PlatformName = styled.div``;

const LinkingButton = styled(Button)`

`;

export default AccountBox;

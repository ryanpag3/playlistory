import React, { useState } from 'react'
import { FaSpotify } from 'react-icons/fa';
import styled from 'styled-components';
import Button from '../../components/Button';
import colors from '../../constants/colors';

const AccountBox = (props: {
    platformName: string;
    onClickLink: () => void;
    onClickUnlink: () => void;
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

    function onClick() {
        if (isLinked) {
            return props.onClickUnlink();
        } else {
            return props.onClickLink();
        }
    }

    return (
        <Container>
            <IconContainer>
                <Icon/>
            </IconContainer>
            <PlatformName>
                {props.platformName}
            </PlatformName>
            <LinkingButton
                onClick={onClick}
            >
                { isLinked ? `Unlink` : `Link` }
            </LinkingButton>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: ${colors.MEDIUM};
    width: 10em;
    height: 12em;
    border-radius: 1em;
    padding: .5em;
`;

const IconContainer = styled.div`
    flex-grow: 1;
    padding-top: .3em;
`;

const SpotifyIcon = styled(FaSpotify)`
    font-size: 6em;
`;

const PlatformName = styled.div`
    padding: .5em;
`;

const LinkingButton = styled(Button)`
    background-color: ${colors.PRIMARY_ACCENT};
    padding-left: 2.5em;
    padding-right: 2.5em;
    margin-bottom: .5em;
    font-weight: bold;
`;

export default AccountBox;

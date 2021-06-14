import React, { Fragment, useEffect, useState } from 'react'
import { FaSpotify } from 'react-icons/fa';
import styled from 'styled-components';
import { CircularProgress, Card } from '@material-ui/core';
import Button from '../../components/Button';
import colors from '../../constants/colors';

const AccountBox = (props: {
    platformName: string;
    isLinked: boolean;
    isLoading: boolean;
    onClickLink: () => Promise<void>;
    onClickUnlink: () => Promise<void>;
}) => {
    const [isLinked, setIsLinked] = useState(props.isLinked);

    useEffect(() => {
        setIsLinked(props.isLinked);
    }, [props.isLinked])

    function Icon() {
        switch (props.platformName.toLowerCase()) {
            case 'spotify':
                return <SpotifyIcon />;
            default:
                return null;
        }
    }

    async function onClick() {
        if (isLinked) {
            const res = await props.onClickUnlink();
            setIsLinked(false);
            return res;
        } else {
            const res = await props.onClickLink();
            setIsLinked(true);
            return res;
        }
    }

    return (
        <Container raised={true} variant="outlined">
            <IconContainer>
                <Icon />
            </IconContainer>
            <PlatformName>
                {props.platformName}
            </PlatformName>
            <LinkingButton
                onClick={onClick}
            >
                {
                    props.isLoading ?
                        <StyledProgress size={25}/> :
                        <Fragment>
                            {(isLinked) ? `Unlink` : `Link`}
                        </Fragment>
                }
            </LinkingButton>
        </Container>
    )
}

const Container = styled(Card)`
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
    min-width: 9em;
    min-height: 3em;
`;

const StyledProgress = styled(CircularProgress)``;

export default AccountBox;

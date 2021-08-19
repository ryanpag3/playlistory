import React, { useEffect } from 'react'
import { Redirect, useHistory } from 'react-router';
import styled from 'styled-components'
import Screen from '../../components/Screen';
import colors from '../../constants/colors';
import { useQuery } from '../../util/query';
import { getCredentials } from '../../util/spotify';
import AccountBox from './AccountBox';
import NavBar from '../../components/NavBar';
import { handleError } from '../../util/axios-error-handler';
import axios, { useAxios } from '../../util/axios';

const AccountLink = () => {
    const history = useHistory();
    const [spotifyIsAuthReq] = useAxios({
        url: '/spotify/is-auth',
        method: 'GET'
    });

    if (spotifyIsAuthReq.error) {
        history.replace('/error');
    }

    useEffect(() => {
        if (!spotifyIsAuthReq.error)
            return;
        handleError(history, spotifyIsAuthReq.error);
    }, [spotifyIsAuthReq.error]);

    const Boxes = [
        {
            platformName: 'Spotify',
            isLinked: spotifyIsAuthReq.data === true ? true : false,
            isLoading: spotifyIsAuthReq.loading === true ? true : false,
            onClickLink: async () => {
                const data = await getCredentials();
                // @ts-ignore
                const oauthUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${data.clientId}&scope=${encodeURIComponent(data.scopes.join(" "))}&redirect_uri=${encodeURIComponent(window._env_.REACT_APP_SPOTIFY_REDIRECT_URI)}`;
                const w: any = window.open(oauthUrl, 'newWindow', 'height=500,width=300');
                const timer = setInterval(() => {
                    if (w.closed) {
                        clearInterval(timer);
                        console.log('closed');
                        // redirect to dashboard
                        history.push('/');
                    }
                }, 250);
            },
            onClickUnlink: async () => {
                try {
                    const res = await axios.delete(`/spotify`);
                    Boxes[0].isLinked = false;
                } catch (e) {
                    history.replace('/error');
                }
            }
        }
    ];

    return (
        <StyledScreen>
            <NavBar/>
            <InfoContainer>
                <PageTitle>Link Accounts</PageTitle>
                <PageDescription>You must link a music account to use Playlistory.</PageDescription>
            </InfoContainer>
            <AccountBoxContainer>
                {
                    Boxes.map(b => <AccountBox key={b.platformName} {...b} />)
                }
            </AccountBoxContainer>
            <ComingSoonMsg>
                More services coming soon...
            </ComingSoonMsg>
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
    padding-top: 2em;
`;

const ComingSoonMsg = styled.div`
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #a7a7a7;
`;

export default AccountLink

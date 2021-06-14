import useAxios from 'axios-hooks';
import React, { useEffect } from 'react'
import styled from 'styled-components'
import Platforms from 'shared/src/Platforms';
import NavBar from '../../components/NavBar';
import Screen from '../../components/Screen'

const Home = () => {
    const [getMyPlaylistsObj, refetch] = useAxios({
        method: 'GET',
        url: '/me/playlists',
        params: {
            platform: Platforms.SPOTIFY,
            offset: 0,
            limit: 50
        }
    });

    useEffect(() => {
        console.log(getMyPlaylistsObj.data);
    }, [getMyPlaylistsObj.data])

    return (
        <StyledScreen>
            <NavBar/>
            Home
        </StyledScreen>
    )
};

const StyledScreen = styled(Screen)`

`;

export default Home;

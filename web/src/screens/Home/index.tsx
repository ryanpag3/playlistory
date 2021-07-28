import useAxios from 'axios-hooks';
import React, { useEffect } from 'react'
import styled from 'styled-components'
import NavBar from '../../components/NavBar';
import Screen from '../../components/Screen'
import PlaylistList from './PlaylistList';

const Home = () => {
    return (
        <StyledScreen>
            <NavBar/>
            <PlaylistList/>
        </StyledScreen>
    )
};

const StyledScreen = styled(Screen)`
    align-items: center;
`;

export default Home;

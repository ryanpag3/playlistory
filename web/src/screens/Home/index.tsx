import useAxios from 'axios-hooks';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Platforms from 'shared/src/Platforms';
import NavBar from '../../components/NavBar';
import Screen from '../../components/Screen'
import PlaylistList from './PlaylistList';
import colors from '../../constants/colors';

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

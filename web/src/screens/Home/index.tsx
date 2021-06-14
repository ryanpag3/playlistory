import React from 'react'
import styled from 'styled-components'
import NavBar from '../../components/NavBar';
import Screen from '../../components/Screen'

const Home = () => {
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

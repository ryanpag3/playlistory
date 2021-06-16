import { Divider } from '@material-ui/core';
import React from 'react'
import { useHistory, useLocation, useParams } from 'react-router';
import styled from 'styled-components';
import InnerContainer from '../../components/InnerContainer';
import NavBar from '../../components/NavBar';
import Screen from '../../components/Screen';
import colors from '../../constants/colors';
import Info from './Info';

const Playlist = (props: any) => {
    const { state } = useLocation();
    const params = useParams();

    return (
        <StyledScreen>
            <NavBar/>
            <StyledInnerContainer>
                <Info { ...state }/>
                <StyledDivider/>
            </StyledInnerContainer>
        </StyledScreen>
    )
}

const StyledScreen = styled(Screen)`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const StyledInnerContainer = styled(InnerContainer)`
    
`;

const StyledDivider = styled(Divider)`
    height: 1.5px;
    background-color: ${colors.MEDIUM_DARK};
`;

export default Playlist

import { Divider, setRef } from '@material-ui/core';
import React, { useRef, useState } from 'react'
import { useHistory, useLocation, useParams } from 'react-router';
import styled from 'styled-components';
import InnerContainer from '../../components/InnerContainer';
import NavBar from '../../components/NavBar';
import Screen from '../../components/Screen';
import colors from '../../constants/colors';
import BackupList from './BackupList';
import Info from './Info';

const Playlist = (props: any) => {
    const { state } = useLocation();
    const [refresh, setRefresh] = useState(0);

    function triggerRefetch() {
        setRefresh(refresh+1);
    }

    return (
        <StyledScreen>
            <NavBar/>
            <StyledInnerContainer>
                <Info { ...state } triggerRefetch={triggerRefetch}/>
                <StyledDivider/>
                <BackupList { ...state } refresh={refresh}/>
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

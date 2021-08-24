import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import NavBar from '../../components/NavBar';
import Screen from '../../components/Screen';
import ColorsNew from '../../constants/colors-new';
import BackupList from './BackupList';
import Info from './Info';

const PlaylistNew = () => {
    const { state } = useLocation();

    const [refresh, setRefresh] = useState(0);

    function triggerRefresh() {
        setRefresh(refresh+1);
    }

    return (
        <Container>
            <NavBar/>
            <InnerContainer>
                <Info {...state } triggerRefresh={triggerRefresh} />
                <BackupList {...state } refresh={refresh} />
            </InnerContainer>
        </Container>
    )
}

const Container = styled(Screen)`
    display: flex;
    align-items: center;
    color: ${ColorsNew.LIGHT};
`;

const InnerContainer = styled.div`
    width: 40em;
`;

export default PlaylistNew;

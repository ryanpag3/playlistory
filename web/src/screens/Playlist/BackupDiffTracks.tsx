import { Divider } from '@material-ui/core';
import React, { useEffect } from 'react'
import styled from 'styled-components';
import ColorsNew from '../../constants/colors-new';
import BackupDiffTracksList from './BackupDiffTracksList';

const BackupDiffTracks = (props: any) => {
    return (
        <Container>
            <BackupDiffTracksList { ...props }/>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;



export default BackupDiffTracks;

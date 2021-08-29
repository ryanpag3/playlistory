import React from 'react'
import styled from 'styled-components';
import ColorsNew from '../../constants/colors-new';

const BackupListRow = (props: any) => {

    function Status() {
        let message;
        switch(props.status) {
            case "COMPLETED":
                message = `Finished on ${new Date(props.finishedAt).toLocaleDateString()} at ${new Date(props.finishedAt).toLocaleTimeString()}`;
                break;
            case "STARTED":
                break;
            case "PENDING":
                break;
            case "ERROR":
                break;
        }
        
        return <StatusText>{message}</StatusText>
    }

    return (
        <Container>
            <InfoContainer>
                <PlaylistName>{props.playlistName}</PlaylistName>
                <Status/>
            </InfoContainer>
            <MenuContainer>

            </MenuContainer>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    flex-direction: row;
    color: ${ColorsNew.LIGHT};
    background-color: ${ColorsNew.BACKGROUND_SECONDARY};
    margin-top: 1em;
    padding: .5em;
    border-radius: .3em;
    width: 100%;
`;

const InfoContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const PlaylistName = styled.div`

`;

const MenuContainer = styled.div`

`;

const StatusText = styled.div`
    font-weight: lighter;
    font-size: .8em;
    margin-top: .5em;
`;

export default BackupListRow;

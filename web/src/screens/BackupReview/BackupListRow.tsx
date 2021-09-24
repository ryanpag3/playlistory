import React, { Fragment } from 'react'
import styled from 'styled-components';
import ColorsNew from '../../constants/colors-new';

const BackupListRow = (props: any) => {
    console.log(props);
    function Status() {
        let message;
        switch (props.status) {
            case "COMPLETED":
                message = `Finished on ${new Date(props.finishedAt).toLocaleDateString()} at ${new Date(props.finishedAt).toLocaleTimeString()}`;
                break;
            case "STARTED":
                message = `Backup started at ${new Date(props.updatedAt).toLocaleDateString()} at ${new Date(props.updatedAt).toLocaleTimeString()}`
                break;
            case "PENDING":
                message = `Queued to run | Position ${props.jobPosition} of ${props.totalJobs}`;
                break;
            case "ERROR":
                message = `Error occured at ${new Date(props.updatedAt).toLocaleDateString()} at ${new Date(props.updatedAt).toLocaleTimeString()} | Please try again.`
                break;
        }

        return <StatusText>{message}</StatusText>
    }

    return (
        <Container>

            <Row>
                <InfoContainer>
                    <PlaylistName>{props.playlistName}</PlaylistName>
                    <Status />  
                </InfoContainer>
                <EmptySpace/>
                <ManifestInfo>
                    {props.backup && <Fragment> &nbsp;
                        <AddedSongs>+&nbsp;{props.backup.manifest.added.length}</AddedSongs> &nbsp; | &nbsp;
                        <RemovedSongs>-&nbsp;{props.backup.manifest.removed.length}</RemovedSongs> &nbsp; | &nbsp;
                        <TotalSongs>{props.backup.manifest.tracks.length}</TotalSongs>
                    </Fragment>}
                </ManifestInfo>
            </Row>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    position: relative;
    flex-direction: row;
    color: ${ColorsNew.LIGHT};
    background-color: ${ColorsNew.BACKGROUND_SECONDARY};
    margin-top: .6em;
    padding: .5em;
    border-radius: .3em;
    width: 100%;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    flex-grow: 1;
`;

const InfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
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

const EmptySpace = styled.div`
    flex-grow: 1;
`;

const ManifestInfo = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: .75em;
`;

const SongText = styled.div`
    font-size: .8em;
    padding: .3em;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const AddedSongs = styled(SongText)`

`;

const RemovedSongs = styled(SongText)`

`;

const TotalSongs = styled(SongText)`

`;

export default BackupListRow;

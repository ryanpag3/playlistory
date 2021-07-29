import useAxios from 'axios-hooks';
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import colors from '../../constants/colors';
import PlaylistRow from './PlaylistRow';

const PlaylistList = (props: any) => {
    const limit = 50;
    const [offset, setOffset] = useState(0);
    const [loadedData, setLoadedData] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [{ data, loading, error }, refetch] = useAxios({
        url: '/me/playlists',
        method: 'GET',
        params: {
            platform: 'SPOTIFY',
            offset,
            limit
        }
    });
    const history = useHistory();

    useEffect(() => {
        if (data === undefined || 
                data.length === undefined && loading)
            return;

        setLoadedData([...loadedData, ...data] as any);

        if (data.length === 0 || data.length < limit) {
            console.log('setting hasMore to false');
            setHasMore(false);
            return;
        }

    }, [ data ]);

    useEffect(() => {
        console.log(`loaded data is now ${loadedData.length}`);

    }, [ loadedData ]);

    async function navToPlaylistPage(playlist: any) {
        console.log(`/playlist/${playlist.id}`)
        return history.push(`/playlist/${playlist.id}`, { playlist });
    }

    async function fetchMoreData() {
        console.log('fetching more data');
        const newOffset = offset + limit;
        setOffset(newOffset);
    }

    return (
        <Container>
            <InfiniteScroll
                dataLength={loadedData.length}
                next={() => fetchMoreData()}
                hasMore={hasMore}
                loader={<h4>loading...</h4>}
            >
                <ChildContainer>
                    <ListHeader>
                        <NameText>
                            Playlist Name
                        </NameText>
                        <TotalTracks>
                            Total Tracks
                        </TotalTracks>
                        <LastBackupText>
                            Last Backed Up
                        </LastBackupText>
                    </ListHeader>
                    {loadedData.map((d: any, index: number) => <PlaylistRow key={index} { ...d }/>)}
                </ChildContainer>
            </InfiniteScroll>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    background-color: ${colors.MEDIUM};
    flex-grow: 1;
`;

const ChildContainer = styled.div`
    min-width: 700px;
    max-width: 50vw;
    flex-grow: 1;
`;

const ListHeader = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    background-color: ${colors.SECONDARY_ACCENT};
    border-bottom: .3em solid ${colors.MEDIUM};
`;

const ListHeaderText = styled.div`
    font-weight: bold;
    padding-bottom: .3em;
    padding-top: .3em;
`;

const NameText = styled(ListHeaderText)`
    padding-left: 3.5em;
    min-width: 50%;
`;

const TotalTracks = styled(ListHeaderText)`
    flex-grow: 1;
    display: flex;
    justify-content: center;
`;

const LastBackupText = styled(ListHeaderText)`
    padding-right: 3.5em;
`;

export default PlaylistList

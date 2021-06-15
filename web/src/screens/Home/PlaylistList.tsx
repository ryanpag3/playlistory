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
        if (data === undefined || data.length === undefined)
            return;

        if (data.length === 0) {
            console.log('setting hasMore to false');
            setHasMore(false);
            return;
        }

        setLoadedData([...loadedData, ...data] as any);
    }, [offset, data]);

    async function navToPlaylistPage(playlist: any) {
        console.log(`/playlist/${playlist.id}`)
        return history.push(`/playlist/${playlist.id}`, { playlist });
    }

    async function fetchMoreData() {
        const newOffset = offset + limit;
        setOffset(newOffset);
    }

    return (
        <Container>
            <InfiniteScroll
                dataLength={loadedData.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={<h4>loading...</h4>}
            >
                <ChildContainer>
                    {loadedData.map((d: any, index: number) => <PlaylistRow key={index} { ...d }/>)}
                </ChildContainer>
            </InfiniteScroll>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    background-color: ${colors.MEDIUM};
`;

const ChildContainer = styled.div`
    min-width: 50vw;
    flex-grow: 1;
`;

export default PlaylistList

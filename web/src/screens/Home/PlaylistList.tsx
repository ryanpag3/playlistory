import { CircularProgress } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { resolveTypeReferenceDirective } from 'typescript';
import colors from '../../constants/colors';
import axios, { useAxios } from '../../util/axios';
import PlaylistRow from './PlaylistRow';

const PlaylistList = (props: any) => {
    const limit = 50;
    const [offset, setOffset] = useState(0);
    const [loadedData, setLoadedData] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isInit, setIsInit] = useState(false);
    const history = useHistory();

    useEffect(() => {
        fetchData(0);
        setIsInit(true);
    }, [isInit === false]);

    useEffect(() => {
        if (hasMore === false)
            return;

        fetchData(offset);
    }, [offset]);

    useEffect(() => {
        console.log(history.location.state);
        // @ts-ignore
        if (history.location.state?.refresh === true)
            refreshData();
    }, [history.location.state]);

    async function refreshData() {
        setLoadedData([] as any);
        fetchData(0);
    }

    async function fetchData(offset: number) {

        try {
            const { data } = await axios({
                url: '/me/playlists',
                method: 'GET',
                params: {
                    platform: 'SPOTIFY',
                    offset,
                    limit
                }
            });

            setLoadedData([...loadedData, ...data] as any);

            if (data.length === 0 || data.length < limit) {
                setHasMore(false);
                return;
            }
        } catch (e) {
            history.replace('/error');
        }

    }

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
                loader={
                    <ProgressCont>
                        <StyledProgress />
                    </ProgressCont>
                }

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
                    {loadedData.map((d: any, index: number) => <PlaylistRow key={index} {...d} />)}
                </ChildContainer>
            </InfiniteScroll>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    background-color: ${colors.LIGHT};
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
    background-color: ${colors.LIGHT};
    border-bottom: .15em solid ${colors.DARK};
    padding-top: .2em;
    cursor: default;
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

const ProgressCont = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1em;
`;

const StyledProgress = styled(CircularProgress)`
    color: ${colors.PRIMARY_ACCENT};
`;

export default PlaylistList

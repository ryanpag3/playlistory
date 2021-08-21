import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useHistory } from 'react-router-dom';
import axios from '../../util/axios';
import BackupDiffRow from './BackupDiffRow';

const BackupList = (props: any) => {
    const limit = 50;
    const history = useHistory();
    const [offset, setOffset] = useState(0);
    const [backups, setBackups] = useState([] as any[]);
    const [hasMore, setHasMore] = useState(true);
    const [isInit, setIsInit] = useState(false);
    const [displayAllTracks, setDisplayAllTracks] = useState(false);

    useEffect(() => {
        if (hasMore === false)
            return;

        fetchBackups(offset);
    }, [offset]);

    useEffect(() => {
        fetchBackups(0);
        setIsInit(true);
    }, [ isInit === false ]);

    function fetchMoreData() {
        const newOff = offset + limit;
        setOffset(newOff);
    }

    async function fetchBackups(offset: number) {
        try {
            console.log('fetching backups');

            const { data } = await axios({
                method: 'GET',
                url: '/backup',
                params: {
                    playlistId: props.id,
                    offset,
                    limit
                }
            });

            setBackups([...backups, ...data]);

            if (data.length < limit) {
                setHasMore(false);
            }
        } catch (e) {
            history.replace('/error');
        }
    }

    return (
        <Container>

            <InfiniteScroll
                dataLength={backups.length}
                next={() => fetchMoreData()}
                hasMore={hasMore}
                loader={<div>loading</div>}
            >
                {backups.map((b, i) => {
                    const res: any = [];
                    if (b.manifest.added.length > 0) {
                        res.push(<BackupDiffRow { ...b } key={i} displayTracks={displayAllTracks} type="add"/>);
                    }
                    
                    if (b.manifest.removed.length > 0) {
                        res.push(<BackupDiffRow { ...b } key={i} displayTracks={displayAllTracks} type="remove"/>);
                    }
                    return res;
                })}
            </InfiniteScroll>
        </Container>
    )
}

const Container = styled.div`
    max-width: 100%;
`;

const TopRow = styled.div``;

export default BackupList;

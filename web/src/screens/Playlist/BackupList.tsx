import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useHistory } from 'react-router-dom';
import axios from '../../util/axios';
import BackupDiffRow from './BackupDiffRow';
import { CircularProgress } from '@material-ui/core';
import ColorsNew from '../../constants/colors-new';

const BackupList = (props: any) => {
    const limit = 50;
    const history = useHistory();
    const [offset, setOffset] = useState(0);
    const [backups, setBackups] = useState([] as any[]);
    const [hasMore, setHasMore] = useState(true);
    const [isInit, setIsInit] = useState(false);
    const [displayAllTracks, setDisplayAllTracks] = useState(false);

    useEffect(() => {
        if (hasMore === false || !isInit)
            return;
        fetchBackups(offset, false);
    }, [ offset ]);

    useEffect(() => {
        if (isInit)
            return;
        fetchBackups(0);
        setIsInit(true);
    }, [ isInit ]);

    useEffect(() => {
        if (!isInit)
            return;
        fetchBackups(0);
    }, [ props.refresh ])

    function fetchMoreData() {
        const newOff = offset + limit;
        setOffset(newOff);
    }

    async function fetchBackups(offset: number, refresh: boolean = true) {
        try {
            const { data } = await axios({
                method: 'GET',
                url: '/backup',
                params: {
                    playlistId: props.id,
                    offset,
                    limit
                }
            });

            if (refresh) {
                setBackups([...data]);
            } else {
                setBackups([...backups, ...data]);
            }

            if (data.length < limit) {
                setHasMore(false);
            }
        } catch (e) {
            history.replace('/error');
        }
    }

    function onDeleted(index: number) {
        backups.splice(index, 1);
        setBackups([...backups]);
    }

    return (
        <Container>

            <InfiniteScroll
                dataLength={backups.length}
                next={() => fetchMoreData()}
                hasMore={hasMore}
                loader={<ProgressCont><StyledProgress /></ProgressCont>}
            >
                {backups.map((b, i) => {
                    const res: any = [];
                    if (hasMore === false && 
                        i === backups.length-1) {
                            res.push(<BackupDiffRow {...b}
                                key={i}
                                displayTracks={displayAllTracks}
                                type="first-backup"
                                onDeleted={() => onDeleted(i)}
                            />);  
                            return res;
                    }
                    
                    if (b.manifest.added.length > 0) {
                        res.push(<BackupDiffRow {...b}
                            key={i}
                            displayTracks={displayAllTracks}
                            type="add"
                            onDeleted={() => onDeleted(i)}
                        />);
                    }

                    if (b.manifest.removed.length > 0) {
                        res.push(<BackupDiffRow {...b}
                            key={i}
                            displayTracks={displayAllTracks}
                            type="remove"
                            onDeleted={() => onDeleted(i)}
                        />);
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

const ProgressCont = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 90%;
    padding: 1em;
`;

const StyledProgress = styled(CircularProgress)`
    color: ${ColorsNew.LIGHT};
`;

export default BackupList;

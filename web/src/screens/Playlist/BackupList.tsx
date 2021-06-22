import { Divider } from '@material-ui/core';
import useAxios from 'axios-hooks';
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component';
import styled from 'styled-components';
import colors from '../../constants/colors';
import BackupListRow from './BackupListRow';

const BackupList = (props: any) => {
    const [backups, setBackups] = useState([] as any);

    const [{ data, loading, error}, refetch] = useAxios({
        method: 'GET',
        url: '/backup',
        params: {
            playlistId: props.id
        }
    });

    useEffect(() => {
        refetch();
    }, [props.refresh]);

    useEffect(() => {
        if (!data)
            return;
        setBackups([ ...data ]);
    }, [ data ]);

    async function handleOnDeleted(index: number) {
        console.log(index);
        backups.splice(index, 1);
        setBackups([ ...backups ]);
    }

    return (
        <Container>
            <HeaderContainer>
                <DateCreatedCont>
                    <HeaderText>
                        Created
                    </HeaderText>
                </DateCreatedCont>
                <NameContainer>
                    <HeaderText>
                        Name
                    </HeaderText>
                </NameContainer>
                <TracksContainer>
                    <HeaderText>
                        Tracks
                    </HeaderText>
                </TracksContainer>
            </HeaderContainer>
            <StyledDivider/>
            <InfiniteScroll
                dataLength={(data ? data.length: 0)}
                next={() => console.log('hmm')}
                hasMore={false}
                loader={<div></div>}
            >
                {(!backups || !backups.length) ? <NoBackupsCont>No backups created yet :(</NoBackupsCont> 
                    : backups.map((d: any, index: number) => <BackupListRow {...d } key={index} index={index} onDeleted={(index: number) => handleOnDeleted(index)}/>)}
            </InfiniteScroll>
        </Container>
    )
}

const Container = styled.div`

`;

const HeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    height: 1.3em;
    width: 100%;
    background-color: ${colors.MEDIUM_DARK};
    padding-top: .1em;
`;

const HeaderText = styled.text`
    font-weight: bold;
    font-size: 1.05em;
`;

const StyledDivider = styled(Divider)`
    height: .15em;
    background-color: ${colors.MEDIUM_DARK};
    border: none;
`;

const HeaderSectionCont = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
`;

const DateCreatedCont = styled(HeaderSectionCont)`
    min-width: 8.5em;
    padding-left: 1em;
`;

const NameContainer = styled(HeaderSectionCont)`
    justify-content: left;
    flex-grow: 1;
`;

const TracksContainer = styled(HeaderSectionCont)`
    margin-right: 3em;
`;

const NoBackupsCont = styled.div`
    width: 100%;
    display: flex;
    padding-top: 3em;
    align-items: center;
    justify-content: center;
`;

export default BackupList

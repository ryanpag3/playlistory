import { Divider } from '@material-ui/core';
import React, { Fragment } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component';
import styled from 'styled-components';
import ColorsNew from '../../constants/colors-new';
import BackupDiffTrackRow from './BackupDiffTrackRow';

const BackupDiffTracksList = (props: any) => {

    return (
        <Container>
            {/* 
                Everything is alreaedy loaded into the query
                We just care about the virtualization at this point
            */}
            <StyledScroll
                dataLength={props.tracks?.length}
                next={() => null}
                hasMore={false}
                loader={<div></div>}
            >
                {
                    props.tracks.map((track: any, i: number) => {
                        return (
                            <Fragment key={i}>
                                <StyledDivider/>
                                <BackupDiffTrackRow {...track}/>
                            </Fragment>
                        )
                    })
                }
            </StyledScroll>
        </Container>
    )
}

const Container = styled.div`
    width: 100%;
`;

// @ts-ignore
const StyledScroll = styled(InfiniteScroll)`
    max-height: 25em;
`;

const StyledDivider = styled(Divider)`
    background-color: ${ColorsNew.LIGHT};
    width: 100%;
    opacity: 20%;
`;

export default BackupDiffTracksList;

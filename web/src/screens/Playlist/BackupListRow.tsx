import React, { Fragment } from 'react'
import styled from 'styled-components';
import moment from 'moment';
import { Button, Divider } from '@material-ui/core';
import { FaEllipsisH } from 'react-icons/fa';
import colors from '../../constants/colors';

const BackupListRow = (props: any) => {
    return (
        <Fragment>
            <Container>
                <DateCreatedCont>
                    <DateCreatedText>{moment(props.createdAt).fromNow()}</DateCreatedText>
                </DateCreatedCont>
                <NameCont>
                    <NameText>{props.name}</NameText>
                </NameCont>
                <SongsCont>
                    <ValueText>{props.playlist.tracks.length}</ValueText> |&nbsp;
                    <AddedSongsText>{props.manifest.added.length !== 0 ? `+${props.manifest.added.length}` : 0}</AddedSongsText> |&nbsp;
                    <RemovedSongsText>{props.manifest.removed.length !== 0 ? `-${props.manifest.removed.length}` : 0}</RemovedSongsText>
                </SongsCont>
                <MenuContainer>
                    <MenuIcon/>
                </MenuContainer>
            </Container>
            <StyledDivider/>
        </Fragment>
    )
}

const Container = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    min-height: 2.5em;
    width: 100%;

    &:hover {
        background-color: ${colors.SECONDARY_ACCENT};
    }
`;

const ValueText = styled.text`
    font-size: .95em;
    font-weight: lighter;
`;

const DateCreatedText = styled(ValueText)`
    font-size: .85em;
`;

const NameText = styled(ValueText)`
    font-weight: normal;

`;

const DateCreatedCont = styled.div`
    padding-left: 1em;
    min-width: 8.5em;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const NameCont = styled.div`
    flex-grow: 1;
`;

const SongsCont = styled.div`

`;

const AddedSongsText = styled(ValueText)`
    color: ${colors.SUCCESS_GREEN};
`;

const RemovedSongsText = styled(ValueText)`
    color: ${colors.ERROR_RED};
`;

const MenuContainer = styled.div`
    padding-left: 1em;
    padding-right: 1em;
    cursor: pointer;
`;

const MenuIcon = styled(FaEllipsisH)`

`;

const StyledDivider = styled(Divider)`
    height: 2px;
    border: none;
`;

export default BackupListRow

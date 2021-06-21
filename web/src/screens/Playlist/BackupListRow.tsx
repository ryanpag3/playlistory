import React, { Fragment, useState } from 'react'
import styled from 'styled-components';
import moment from 'moment';
import { Button, Divider, Menu, MenuItem, Tooltip } from '@material-ui/core';
import { FaEllipsisH } from 'react-icons/fa';
import colors from '../../constants/colors';
import axios from 'axios';

const BackupListRow = (props: any) => {
    const [anchorEl, setAnchorEl] = useState(null);

    async function undoAdded() {
        const res = await axios({
            method: 'PUT',
            url: '/playlist/revert/added',
            params: {
                backupId: props.id
            }
        });
        console.log(res);
    }

    async function undoRemoved() {
        const res = await axios({
            method: 'PUT',
            url: '/playlist/revert/removed',
            params: {
                backupId: props.id
            }
        });
        console.log(res);
    }

    async function restoreToThisPoint() {

    }

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
                <MenuContainer
                    // @ts-ignore
                    onClick={(event: any) => setAnchorEl(event.currentTarget)}
                >
                    <MenuIcon/>
                </MenuContainer>
                <StyledMenu
                    id="row-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClick={() => setAnchorEl(null)}
                >
                    <Tooltip title="Remove the songs added in this backup." enterDelay={1500}>
                        <StyledMenuItem
                            onClick={undoAdded}
                        >Undo Added</StyledMenuItem>
                    </Tooltip>
                    <Tooltip title="Add the songs removed in this backup." enterDelay={1500}>
                        <StyledMenuItem
                            onClick={undoRemoved}
                        >Undo Removed</StyledMenuItem>
                    </Tooltip>
                    <StyledMenuItem
                        onClick={restoreToThisPoint}
                    >Restore To This Point</StyledMenuItem>
                </StyledMenu>
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

const StyledMenu = styled(Menu)`

    & .MuiPaper-root {
        background-color: ${colors.LIGHT};
    }
`;

const StyledMenuItem = styled(MenuItem)`

`;

const StyledDivider = styled(Divider)`
    height: 2px;
    border: none;
`;

export default BackupListRow

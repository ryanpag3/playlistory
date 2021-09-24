import { Menu, MenuItem, Tooltip } from '@material-ui/core';
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import axios from '../../util/axios';

const BackupMenu = (props: any) => {
    const history = useHistory();
    const [anchorEl, setAnchorEl] = useState(null);

    async function undo() {
        if (props.type === "add") {
            return undoAdded();
        } else if (props.type === "remove") {
            return undoRemoved();
        }

        return;
    }

    async function undoAdded() {
        try {
            console.log('added')
            const res = await axios({
                method: 'PUT',
                url: '/playlist/revert/added',
                params: {
                    backupId: props.id
                }
            });
        } catch (e) {
            history.replace('/error');
        }
    }

    async function undoRemoved() {
        try {
            console.log('removed')
            const res = await axios({
                method: 'PUT',
                url: '/playlist/revert/removed',
                params: {
                    backupId: props.id
                }
            });
        } catch (e) {
            history.replace('/error');
        }
    }

    async function restore() {
        try {
            const res = await axios({
                method: 'PUT',
                url: '/playlist/restore',
                params: {
                    backupId: props.id
                }
            });
        } catch (e) {
            history.replace('/error');
        }
    }

    async function deleteBackup() {
        try {
            const res = await axios({
                method: 'DELETE',
                url: '/backup',
                params: {
                    id: props.id
                }
            });
            props.onDeleted(props.index);
        } catch (e) {
            history.replace('/error');
        }
    }

    return (
        <Container>
            <StyledMenu
                id="backup-menu"
                anchorEl={props.anchor}
                open={props.open}
                onClick={(e) => {
                    e.stopPropagation();
                    props.setOpen(false)
                }}
            >
                <Tooltip title="Remove the songs added in this backup." enterDelay={500}>
                    <StyledMenuItem
                        onClick={undo}
                    >Undo Changes</StyledMenuItem>
                </Tooltip>
                <Tooltip title="Restore the playlist to this point in history." enterDelay={500}>

                    <StyledMenuItem
                        onClick={restore}
                    >Revert To Here</StyledMenuItem>
                </Tooltip>
                <StyledMenuItem
                    onClick={deleteBackup}
                >Delete Backup</StyledMenuItem>
            </StyledMenu>
        </Container>
    )
}

const Container = styled.div`

`;

const StyledMenu = styled(Menu)`

`;

const StyledMenuItem = styled(MenuItem)`

`;

export default BackupMenu;

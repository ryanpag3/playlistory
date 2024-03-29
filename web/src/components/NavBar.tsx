import React, { Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import { AppBar, CircularProgress, IconButton, Link, List, ListItem, ListItemText, SwipeableDrawer, Toolbar } from '@material-ui/core';
import { FaBars } from 'react-icons/fa';
import { MdQueueMusic } from 'react-icons/md';
import colors from '../constants/colors';
import { useHistory } from 'react-router';
import axios, { useAxios } from '../util/axios';
import { truncate } from 'fs';
import BetaBadge from './BetaBadge';

const NavBar = () => {
    const history = useHistory();
    const [openMenu, setOpenMenu] = useState(false);
    const [me, setMe] = useState();

    const [getMeObj, refetch] = useAxios({
        method: 'GET',
        url: '/user/me'
    });

    if (getMeObj?.error) {
        history.replace('/error');
    }

    useEffect(() => {
        if (!getMeObj || !getMeObj.data)
            return;
        setMe(getMeObj.data);
    }, [getMeObj.data])

    function toggleMenu() {
        setOpenMenu(!openMenu);
    }

    function navToRoute(path: string) {
        if (history.location.pathname === path) {
            history.go(0);
            toggleMenu();
            return;
        }
        history.push(path, {
            refresh: true
        });
    }

    async function logout() {
        try {
            await axios.post('/logout');
            history.replace('/login');
        } catch (e) {
            history.replace('/error');
        }
    }

    function Upgrade() {
        if (getMeObj.loading) {
            return <StyledProgress size={25}/>;
        // @ts-ignore
        } else if (history.location.pathname !== '/upgrade' && me && !me.isSubscribed) {
            return (
                <UpgradeAccountLinkContainer
                    onClick={() => {
                        const path = '/upgrade';
                        if (history.location.pathname === path) {
                            return;
                        }
                        history.push(path);
                    }}
                >
                    <UpgradeAccountLink>Upgrade Account</UpgradeAccountLink>
                </UpgradeAccountLinkContainer>
            )
        }

        return null;
    }

    return (
        <AppBar position="static">
            <StyledToolbar>
                <Fragment>
                    <MenuIconContainer edge="start"
                        onClick={toggleMenu}
                    >
                        {/* @ts-ignore */}
                        <MenuIcon />
                    </MenuIconContainer>
                    <BetaBadge/>
                    <StyledDrawer
                        anchor="left"
                        open={openMenu}
                        onClose={toggleMenu}
                        onOpen={toggleMenu}
                    >
                        <StyledList>
                            <ListItem button
                                onClick={() => navToRoute('/')}
                            >
                                <StyledListItemText>
                                    Home
                                </StyledListItemText>
                            </ListItem>
                            <ListItem button
                                onClick={() => navToRoute('/settings')}
                            >
                                <StyledListItemText>
                                    Account Settings
                                </StyledListItemText>
                            </ListItem>
                            <ListItem button
                                onClick={() => navToRoute('/connections')}
                            >
                                <StyledListItemText>
                                    Music Connections
                                </StyledListItemText>
                            </ListItem>

                            <ListItem button
                                onClick={() => navToRoute('/upgrade')}
                            >
                                <StyledListItemText>
                                    Manage Subscription
                                </StyledListItemText>
                            </ListItem>
                            <ListItem button
                                onClick={() => logout()}
                            >
                                <StyledListItemText>
                                    Sign Out
                                </StyledListItemText>
                            </ListItem>
                        </StyledList>
                    </StyledDrawer>
                </Fragment>
                <EmptySpace />
                <BackupStatusCont
                    onClick={() => navToRoute('/backups')}
                >
                    <BackupStatusIcon size={25}/>
                </BackupStatusCont>
                <Upgrade/>
            </StyledToolbar>
        </AppBar>
    )
}

const StyledToolbar = styled(Toolbar)`
    background-color: ${colors.EXTRA_DARK};
    min-height: 36px;
`;

const MenuIconContainer = styled(IconButton)`
    padding: 2px;
`;

const MenuIcon = styled(FaBars)`
    color: ${colors.LIGHT};
    font-size: 1em;
`;




const StyledDrawer = styled(SwipeableDrawer)`

`;

const StyledList = styled(List)`
    min-width: 12em;
    background-color: ${colors.DARK};
    height: 100%;
`;

const StyledListItemText = styled(ListItemText)`
    text-align: center;
    padding-right: 10px;
    color: ${colors.LIGHT};
    font-size: 16px;
`;

const EmptySpace = styled.div`
    flex-grow: 1;
`;

const BackupStatusCont = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
`;

const BackupStatusIcon = styled(MdQueueMusic)`

`;

const UpgradeAccountLinkContainer = styled.div`
    margin-left: 1em;
`;

const UpgradeAccountLink = styled.h2`
    font-size: .8em;
    cursor: pointer;
`;

const StyledProgress = styled(CircularProgress)`
    color: ${colors.MEDIUM};
`;

export default NavBar

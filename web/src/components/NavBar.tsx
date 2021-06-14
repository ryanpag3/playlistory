import React, { Fragment, useState } from 'react';
import styled from 'styled-components';
import { AppBar, IconButton, Link, List, ListItem, ListItemText, SwipeableDrawer, Toolbar } from '@material-ui/core';
import { FaBars } from 'react-icons/fa';
import colors from '../constants/colors';
import { useHistory } from 'react-router';

const NavBar = () => {
    const history = useHistory();
    const [openMenu, setOpenMenu] = useState(false);

    function toggleMenu() {
        setOpenMenu(!openMenu);
    }

    function navToRoute(path: string) {
        if (history.location.pathname === path) {
            toggleMenu();
            return;
        }
        history.push(path);
    }

    return (
        <AppBar position="static">
            <StyledToolbar>
                <Fragment>
                    <MenuIconContainer edge="start"
                        onClick={toggleMenu}
                    >
                        {/* @ts-ignore */}
                        <MenuIcon/>
                    </MenuIconContainer>
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
                                onClick={() => navToRoute('/accounts')}
                            >
                                <StyledListItemText>
                                    Accounts
                                </StyledListItemText>
                            </ListItem>
                            <ListItem button
                                onClick={() => navToRoute('/')}
                            >
                                <StyledListItemText>
                                    Sign Out
                                </StyledListItemText>
                            </ListItem>
                        </StyledList>
                    </StyledDrawer>
                </Fragment>
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

export default NavBar


import { Button, Divider } from '@material-ui/core';
import React, { Fragment } from 'react'
import styled from 'styled-components';
import { FaEllipsisH } from 'react-icons/fa';
import colors from '../../constants/colors';

const PlaylistRow = (props: any) => {
    return (
        <ParentContainer>
            <Container>
                <ImageContainer>
                    <Image src={props.imageUrl} />
                </ImageContainer>
                <NameContainer>
                    <Name>{props.name}</Name>
                </NameContainer>
                <TrackCountContainer>
                    <TrackCount>{props.tracks.total}</TrackCount>
                </TrackCountContainer>
                <LastBackupContainer>
                    <LastBackup>A few hours ago</LastBackup>
                </LastBackupContainer>
                <MenuContainer>
                    <MenuButton disableRipple >
                        <MenuIcon />
                    </MenuButton>
                </MenuContainer>
            </Container>
            {/* <StyledDivider /> */}
        </ParentContainer>
    )
}

const ParentContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: .25em;
`;

const Container = styled.div`
    display: flex;
    flex-direction: row;
    padding-top: .1em;
    padding-bottom: .1em;
    background-color: ${colors.LIGHT};
    width: 100%;
`;

const ImageContainer = styled.div`
    padding-left: .5em;
`;

const Image = styled.img`
    width: 2.5em;
    height: 2.5em;
    border-radius: 1.5em;
`;

const NameContainer = styled.div`
    display: flex;
    align-items: center;
    width: 50%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding-left: .5em;
`;

const Name = styled.span`
    font-size: 14px;
`;

const TrackCountContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 1em;
    flex-grow: 1;
`;

const TrackCount = styled.span``;

const LastBackupContainer = styled.div`
    display: flex;
    align-items: center;
    padding-left: 1em; 
`;

const LastBackup = styled.span`
    font-size: 14px;
`;

const MenuContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const MenuButton = styled(Button)`
    height: 50%;
    &:hover {
        background-color: transparent;
    }
`;

const MenuIcon = styled(FaEllipsisH)`
    font-size: 20px;
`;

const StyledDivider = styled(Divider)`
    width: 100%;
`;
export default PlaylistRow

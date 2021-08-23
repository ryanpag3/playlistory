import moment from 'moment';
import React, { useState } from 'react'
import { FaAngleDown, FaAngleUp, FaEllipsisH } from 'react-icons/fa';
import styled from 'styled-components';
import ColorsNew from '../../constants/colors-new';
import BackupDiffTracks from './BackupDiffTracks';
import BackupMenu from './BackupMenu';

moment.locale('en', {
    relativeTime: {
        future: '%s',
        past: '%s',
        s: '5s',
        ss: '%ss',
        m: '%dm',
        mm: '%dm',
        h: '%dh',
        hh: '%dh',
        d: '1d',
        dd: '%dd',
        M: '1M',
        MM: '%dM',
        y: '1Y',
        yy: '%dY'
    }
});

const BackupDiffRow = (props: any) => {
    const [displayTracks, setDisplayTracks] = useState(props.displayTracks);
    const [displayMenu, setDisplayMenu] = useState(false);
    const [anchor, setAnchor] = useState(null);

    function getDiffText() {
        if (props.type === "first-backup") {
            return `First backup! ✨ ${props.playlist.tracks.length} songs saved.`;
        } else if (props.type === "add") {
            return `${props.manifest.added.length} songs added`;
        } else if (props.type === "remove") {
            return `${props.manifest.removed.length} songs removed.`;
        }
        throw new Error(`Invalid type provided.`);
    }

    return (
        <OuterContainer
            onClick={() => setDisplayTracks(!displayTracks)}
        >
            <TopRowContainer>
                <DateContainer>
                    <DateText>{moment(props.createdAt).fromNow()}</DateText>
                </DateContainer>
                <ColumnContainer>
                    <DiffTextContainer>
                        <DiffText>{getDiffText()}</DiffText>
                        <EmptySpace />
                        <IconCont>
                            <MenuContainer
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // @ts-ignore
                                    setAnchor(e.currentTarget);
                                    setDisplayMenu(true);
                                }}
                            >
                                <MenuIcon size={20} />
                            </MenuContainer>
                        </IconCont>
                    </DiffTextContainer>
                    {
                            displayTracks &&
                            <BackupDiffTracks tracks={ props.type === "add" ? props.manifest.added : props.manifest.removed } platform={ props.playlist.platform } />
                    }
                </ColumnContainer>
            </TopRowContainer>
            <BackupMenu 
                id={props.id}
                onDeleted={(index: number) => props.onDeleted(index)}
                anchor={anchor} 
                open={displayMenu} 
                setOpen={(open: boolean) => {
                setAnchor(null);
                setDisplayMenu(open)
            }} />
        </OuterContainer>
    )
}

const OuterContainer = styled.div`
    max-width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: .5em;
    cursor: default;
    cursor: pointer;
`;

const TopRowContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

const DateContainer = styled.div`
    display: flex;
    justify-content: center;
    padding-top: .6em;
    min-width: 2em;
    margin-right: .5em;
    font-weight: lighter;
`;

const DateText = styled.div`
    color: ${ColorsNew.MEDIUM};
    font-size: .85em;
`;

const ColumnContainer = styled.div`
    display: flex;
    background-color: ${ColorsNew.BACKGROUND_SECONDARY};
    border-radius: .25em;
    flex-direction: column;
    flex-grow: 1;
`;

const DiffTextContainer = styled.div`
    display: flex;
    flex-direction: row;
    padding: .4em;
    padding-left: 1em;
    padding-right: 1em;
    flex-grow: 1;
`;

const DiffText = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: .9em;
`;

const EmptySpace = styled.div`
    flex-grow: 1;
`;

const IconCont = styled.div`
    display: flex;
    flex-direction: row;
    color: ${ColorsNew.MEDIUM};
`;

const MenuContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 1;
`;

const MenuIcon = styled(FaEllipsisH)`
    
`;

const ExpandContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 1em;
    cursor: pointer;
`;

const ExpandIconDown = styled(FaAngleDown)`

`;

const ExpandIconUp = styled(FaAngleUp)`

`;

export default BackupDiffRow;

import moment from 'moment';
import React, { useState } from 'react'
import { FaAngleDown, FaAngleUp, FaEllipsisH } from 'react-icons/fa';
import styled from 'styled-components';
import ColorsNew from '../../constants/colors-new';
import BackupDiffTracks from './BackupDiffTracks';

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
        d: 'a day',
        dd: '%dd',
        M: 'a month',
        MM: '%dM',
        y: 'a year',
        yy: '%dY'
    }
});

const BackupDiffRow = (props: any) => {
    console.log(props);

    const [displayTracks, setDisplayTracks] = useState(props.displayTracks);

    function getDiffText() {
        if (props.type === "add") {
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
                            <MenuContainer>
                                <MenuIcon size={20} />
                            </MenuContainer>
                        </IconCont>
                    </DiffTextContainer>
                    {
                            displayTracks &&
                            <BackupDiffTracks songs={ props.type === "add" ? props.manifest.added : props.manifest.removed } platform={ props.playlist.platform } />
                    }
                </ColumnContainer>
            </TopRowContainer>
        </OuterContainer>
    )
}

const OuterContainer = styled.div`
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
    align-items: center;
    min-width: 2em;
    margin-right: .5em;
    font-weight: lighter;
`;

const DateText = styled.div`
    color: ${ColorsNew.MEDIUM};
`;

const ColumnContainer = styled.div`
    display: flex;
    background-color: ${ColorsNew.BACKGROUND_SECONDARY};
    flex-direction: column;
    flex-grow: 1;
`;

const DiffTextContainer = styled.div`
    display: flex;
    flex-direction: row;
    padding: .4em;
    padding-left: 1em;
    padding-right: 1em;
    border-radius: .25em;
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

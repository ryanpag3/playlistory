import { Dialog, DialogTitle } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import colors from '../../constants/colors';

const UpgradeNeededDialog = (props: any) => {
    const history = useHistory();
    const [showDialog, setShowDialog] = useState(props.showDialog || false);

    useEffect(() => {
        setShowDialog(props.showDialog);
    }, [ props.showDialog !== showDialog])

    function onCloseDialog() {
        props.setShowDialog(false);
        setShowDialog(false);
    }

    return (
        <Container>
            <StyledDialog
                open={showDialog}
                onClose={onCloseDialog}
            >
                <DialogTitle>Premium Access Required</DialogTitle>
                <Description>
                    Free users can only backup 3 playlists with 3 backups each. Either delete previous backups or upgrade your account to premium.
                    <br/><br/>
                    <UpgradeLink
                        onClick={() => { history.push('/upgrade') }}
                    >Click here to see information on upgrading your account.</UpgradeLink>
                </Description>
            </StyledDialog>
        </Container>
    )
}

const Container = styled.div`
`;

const StyledDialog = styled(Dialog)`
`;

const Description = styled.div`
    font-family: 'Lato', sans-serif;
    padding-left: 1.5em;
    padding-right: 1.5em;
    padding-bottom: 1.5em;
    max-width: 26em;
`;

const UpgradeLink = styled.a`
    color: ${colors.PRIMARY_ACCENT};
    cursor: pointer;
`;

export default UpgradeNeededDialog;
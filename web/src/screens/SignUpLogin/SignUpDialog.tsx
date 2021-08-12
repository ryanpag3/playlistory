import { Button, Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import React from 'react'
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import colors from '../../constants/colors';

const SignUpDialog = (props: any) => {
    const history = useHistory();

    function continueNav() {
        history.replace('/connections');
    }

    return (
        <Container>
            <StyledDialog
                open={props.modalOpened}
                onClose={props.onClosedModal}
            >
                <DialogContainer>
                    <StyledDialogTitle>Sign Up Successful.</StyledDialogTitle>
                    <DialogContent>
                        <Description>
                            {/* You will receive an email to verify your account. */ } Press the button below to continue to Playlistory.
                        </Description>
                        <ContinueButtonContainer>
                            <ContinueButton
                                onClick={() => continueNav()}
                            >
                                Continue
                            </ContinueButton>
                        </ContinueButtonContainer>
                    </DialogContent>
                </DialogContainer>
            </StyledDialog>
        </Container>
    )
}

const Container = styled.div`

`;

const StyledDialog = styled(Dialog)`
    
`;

const DialogContainer = styled.div`

`;

const StyledDialogTitle = styled(DialogTitle)`

`;

const Description = styled.div`
    font-family: 'Lato', sans-serif;
    padding-bottom: 1em;
    max-width: 25em;
`;

const ContinueButtonContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ContinueButton = styled(Button)`
    background-color: ${colors.PRIMARY_ACCENT};
    min-width: 125px;
    font-weight: bold;
    margin-bottom: 1em;

    &:hover {
        background-color: ${colors.SECONDARY_ACCENT};
    }
`;

export default SignUpDialog;

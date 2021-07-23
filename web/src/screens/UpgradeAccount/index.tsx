/* 
 * Copyright (C) Ryan Page - All Rights Reserved
 * For more information, refer to LICENSE file.
 */
import axios from 'axios';
import React, { useState } from 'react'
import styled from 'styled-components';
import Button from '../../components/Button';
import NavBar from '../../components/NavBar';
import Screen from '../../components/Screen';
import colors from '../../constants/colors';
import AccountTierBox from './AccountTierBox';

const UpgradeAccount = () => {
    // TODO: query this ahead of time to allow for new sessions w/ upgraded users
    const [isUpgraded, setIsUpgraded] = useState(false);

    async function subscribeUser() {
        await axios('/user/subscribe', {
            method: 'POST'
        })
        setIsUpgraded(true);
    }

    async function unsubscribeUser() {
        await axios('/user/unsubscribe', {
            method: 'POST'
        })
        setIsUpgraded(false);
    }

    return (
        <Container>
            <NavBar />
            <AccountTiersContainer>
                <AccountTierBox
                    accountTitle="Free"
                    features={[
                        "Backup up to three playlists.",
                        "Save up to three backups per playlist.",
                        "Run one backup per week manually."
                    ]}
                />
                <AccountTierBox
                    accountTitle="Premium"
                    price="$3/month"
                    features={[
                        "Backup unlimited playlists.",
                        "Run backups as often as you'd like.",
                        "Save as many backups as you'd like.",
                        "Schedule backups to run automatically."
                    ]}
                    SubmitButton={UpgradeButton}
                    buttonText={!isUpgraded ? 'Subscribe' : 'Unsubscribe' }
                    onSubmit={!isUpgraded ? subscribeUser : unsubscribeUser}
                />
            </AccountTiersContainer>
        </Container>
    )
}

const Container = styled(Screen)`
    align-items: center;
`;

const AccountTiersContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 2em;
`;

const UpgradeButton = styled(Button)`
    padding-left: 1.5em;
    padding-right: 1.5em;
    background-color: ${colors.PRIMARY_ACCENT};
    color: ${colors.LIGHT};

    &:hover {
        background-color: ${colors.DARK};
    }
`;

export default UpgradeAccount

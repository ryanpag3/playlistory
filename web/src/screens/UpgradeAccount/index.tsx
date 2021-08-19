/* 
 * Copyright (C) Ryan Page - All Rights Reserved
 * For more information, refer to LICENSE file.
 */
import axios from '../../util/axios';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import Button from '../../components/Button';
import NavBar from '../../components/NavBar';
import Screen from '../../components/Screen';
import colors from '../../constants/colors';
import { useAxios } from '../../util/axios';
import AccountTierBox from './AccountTierBox';
import { useHistory } from 'react-router-dom';

const UpgradeAccount = () => {
    const history = useHistory();
    // TODO: query this ahead of time to allow for new sessions w/ upgraded users
    const [isUpgraded, setIsUpgraded] = useState(false);

    const [getMeObj, refetch] = useAxios({
        method: 'GET',
        url: '/user/me'
    });

    if (getMeObj.error) {
        history.replace('/error');
    }

    useEffect(() => {
        if (!getMeObj.data)
            return;
        setIsUpgraded(getMeObj.data.isSubscribed);
    }, [getMeObj.loading])

    async function subscribeUser() {
        try {
            await axios('/user/subscribe', {
                method: 'POST'
            })
            setIsUpgraded(true);
        } catch (e) {
            history.replace('/error');
        }
    }

    async function unsubscribeUser() {
        try {
            await axios('/user/unsubscribe', {
                method: 'POST'
            })
            setIsUpgraded(false);
        } catch (e) {
            history.replace('/error');
        }
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
                    loading={false}
                />
                <AccountTierBox
                    accountTitle="Premium"
                    price="$0/month (during beta)"
                    features={[
                        "Backup unlimited playlists.",
                        "Run backups as often as you'd like.",
                        "Save as many backups as you'd like.",
                        "Schedule backups to run automatically."
                    ]}
                    SubmitButton={UpgradeButton}
                    buttonText={!isUpgraded ? 'Subscribe' : 'Unsubscribe'}
                    onSubmit={!isUpgraded ? subscribeUser : unsubscribeUser}
                    loading={getMeObj.loading}
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
    min-width: 12em;
    background-color: ${colors.PRIMARY_ACCENT};
    color: ${colors.LIGHT};

    &:hover {
        background-color: ${colors.DARK};
    }
`;

export default UpgradeAccount

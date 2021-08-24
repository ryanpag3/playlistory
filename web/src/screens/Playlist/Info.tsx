import { Button, Switch, withStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import PlatformIcon from '../../components/PlatformIcon';
import ColorsNew from '../../constants/colors-new';
import axios, { useAxios } from '../../util/axios';
import ScheduleMenu from './ScheduleMenu';

const Info = (props: any) => {
    const history = useHistory();
    const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
    const [isSubmittingBackup, setIsSubmittingBackup] = useState(false);
    const [scheduledChecked, setScheduledChecked] = useState(props.scheduledBackup || false);
    const [me, setMe] = useState();

    const [getMeObj, refetch] = useAxios({
        method: 'GET',
        url: '/user/me'
    });

    useEffect(() => {
        if (!getMeObj || !getMeObj.data)
            return;
        setMe(getMeObj.data);
    }, [getMeObj.data]);

    async function backupNow() {
        try {
            setIsSubmittingBackup(true);
            await axios.post('/backup', {
                playlistId: props.id,
                platform: props.platform
            });
            props.triggerRefresh();
        } catch (e) {
            if (e.toString().includes('403')) {
                setTimeout(() => setShowUpgradeDialog(true), 25);
            } else {
                history.replace('/error');
            }
        }
        setIsSubmittingBackup(false);
    }

    async function cleanupScheduledBackups() {
        try {
            await axios.delete('/backup/scheduled', {
                params: {
                    playlistId: props.id
                }
            })
        } catch (e) {
            history.replace('/error');
        }
    }

    return (
        <Container>
            <ImageContainer>
                <Image src={props.imageUrl} />
            </ImageContainer>
            <InnerContainer>
                <OwnerContainer
                    onClick={() => window.open(props.owner.url, '_blank')}
                >
                    <StyledPlatformIcon platform={props.platform} />
                    <OwnerText>
                        {props.owner?.name}
                    </OwnerText>
                </OwnerContainer>
                <TitleText
                    onClick={() => window.open(props.url, '_blank')}
                >
                    {props.name}
                </TitleText>
                <DescriptionCont>
                    <DescriptionText>
                        {props.description || 'No description.'}
                    </DescriptionText>
                </DescriptionCont>
                <BottomContainer>
                    <BackupButton
                        onClick={() => backupNow()}
                    >
                        Backup
                    </BackupButton>
                    {
                        // @ts-ignore
                        (me && me?.isSubscribed) &&
                        <SwitchCont>
                            <SwitchLabel>Scheduled</SwitchLabel>
                            <ScheduledSwitch checked={scheduledChecked} onChange={(e) => {
                                setScheduledChecked(e.target.checked);
                                if (e.target.checked === false) {
                                    cleanupScheduledBackups();
                                }
                            }} />
                            {
                                scheduledChecked &&
                                <ScheduleMenu
                                    id={props.id}
                                    platform={props.platform}
                                    isScheduled={scheduledChecked}
                                />
                            }
                        </SwitchCont>
                    }

                </BottomContainer>
            </InnerContainer>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 1em;
`;

const InnerContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const ImageContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: .5em;
`;

const Image = styled.img`
    max-width: 11em;
`;

const OwnerContainer = styled.div`
    display: flex;
    flex-direction: row;
    color: ${ColorsNew.LIGHT};
    cursor: pointer;
`;

const StyledPlatformIcon = styled(PlatformIcon)`
    margin-right: .5em;
`;

const OwnerText = styled.div`
    font-weight: lighter;
`;

const TitleText = styled.div`
    margin-top: .2em;
    font-size: 2em;
    font-weight: bold;
    text-overflow: ellipsis;
    cursor: pointer;
`;

const DescriptionCont = styled.div`
    flex-grow: 1;
`;

const DescriptionText = styled.div`
    font-size: 1em;
    font-weight: lighter;
`;

const BottomContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

const BackupButton = styled(Button)`
    background-color: ${ColorsNew.BUTTON_PRIMARY};
    color: ${ColorsNew.LIGHT};
    font-weight: bold;
    padding-top: .6em;
    padding-left: 1em;
    padding-right: 1em;

    &:hover {
        background-color: ${ColorsNew.BUTTON_PRIMARY_HOVER};
    }
`;

const SwitchCont = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-left: 1em;
`;

const SwitchLabel = styled.span`
    font-size: .8em;
`;


const ScheduledSwitch = withStyles({
    switchBase: {
        color: ColorsNew.LIGHT,
        '&$checked': {
            color: ColorsNew.BUTTON_PRIMARY_HOVER,
        },
        '&$checked + $track': {
            backgroundColor: ColorsNew.LIGHT,
        },
    },
    checked: {},
    track: {},
})(Switch);

export default Info;

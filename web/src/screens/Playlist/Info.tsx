import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { IoMdPerson } from 'react-icons/io';
import { Button, Checkbox, Dialog, DialogContent, DialogTitle, FormControl, FormControlLabel, InputLabel, makeStyles, MenuItem, Select, TextField, Tooltip } from '@material-ui/core';
import colors from '../../constants/colors';
import UpgradeNeededDialog from './UpgradeNeededDialog';
import axios, { useAxios } from '../../util/axios';

const useStyles = makeStyles((theme: any) => ({
    select: {
        color: `${colors.DARK} !important`,
        '&:before': {
            borderColor: colors.DARK
        },
        '&:after': {
            borderColor: colors.DARK
        }
    },
    label: {
        color: `${colors.DARK} !important`
    }
}));

const Info = (props: any) => {
    const [isInit, setIsInit] = useState(false);
    const [modalOpened, setModalOpened] = useState(false);
    const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
    const [interval, setInterval] = useState(props.scheduledBackup ? props.scheduledBackup.interval : 'day');
    const [scheduledChecked, setScheduledChecked] = useState(props.scheduledBackup !== undefined ? true : false);
    const [me, setMe] = useState();
    const [backupName, setBackupName] = useState();

    const classes = useStyles();

    const [getMeObj, refetch] = useAxios({
        method: 'GET',
        url: '/user/me'
    });

    useEffect(() => {
        if (!getMeObj || !getMeObj.data)
            return;
        setMe(getMeObj.data);
    }, [getMeObj.data])

    useEffect(() => {
        if (!isInit)
            return;

        if (scheduledChecked === false) {
            cleanupScheduledBackups();
        } else if (interval) {
            const runNow = false;
            submitBackup(runNow);
        }
    }, [scheduledChecked, interval]);

    useEffect(() => {
        setIsInit(true);
    }, [isInit === false])

    async function handleIntervalChange(changed: any) {
        setInterval(changed.target.value);
    }

    async function cleanupScheduledBackups() {
        await axios.delete('/backup/scheduled', {
            params: {
                playlistId: props.id
            }
        })
    }

    async function submitBackup(runNow: boolean = true) {
        try {
            await axios.post('/backup', {
                playlistId: props.id,
                platform: props.platform,
                backupName,
                interval: (scheduledChecked === true && runNow === false) ? interval : undefined
            });
            
            // scheduled
            if (!runNow)
                return;

            props.triggerRefetch();
            setModalOpened(false);
        } catch (e) {
            if (e.toString().includes('403')) {
                setModalOpened(false);
                setTimeout(() => setShowUpgradeDialog(true), 25);
            }
        }
    }

    async function openBackupModal() {
        setModalOpened(true);

    }

    function onClosedModal() {
        setModalOpened(false);
    }

    function ScheduledMenu() {
        // @ts-ignore
        if (getMeObj.loading || (me && me.isSubscribed === false))
            return null;
        return (
            <ScheduledContainer>
                <ScheduledFormLabel
                    control={
                        <ScheduledCheckbox
                            checked={scheduledChecked}
                            onChange={(e) => setScheduledChecked(e.target.checked)}
                            style={{
                                color: colors.PRIMARY_ACCENT
                            }}
                        />
                    }
                    label="Scheduled"
                />
                {
                    scheduledChecked &&
                    <FormControl
                    >
                        <Tooltip title="Backups always start at the top of the interval. For example, every week would be on Sunday at 12am PST. Every day would be 12am PST, etc.">
                            <InputLabel id="interval-label" className={classes.label}>Interval</InputLabel>
                        </Tooltip>
                        <StyledSelect
                            labelId="interval-label"
                            value={interval}
                            onChange={handleIntervalChange}
                            className={classes.select}
                        >
                            <MenuItem value="hour">Once per hour</MenuItem>
                            <MenuItem value="day">Once per day</MenuItem>
                            <MenuItem value="week">Once per week</MenuItem>
                            <MenuItem value="month">Once per month</MenuItem>
                            <MenuItem value="year">Once per year</MenuItem>
                        </StyledSelect>
                    </FormControl>
                }
            </ScheduledContainer>
        )
    }

    return (
        <Container>
            <ImageContainer>
                <Image src={props.imageUrl} />
            </ImageContainer>
            <TextContainer>
                <PlatformContainer>
                    <Platform>
                        {props.platform}
                    </Platform>
                </PlatformContainer>
                <TitleContainer
                    onClick={() => window.open(props.url, '_blank')}
                >
                    <Title>{props.name}</Title>
                </TitleContainer>
                <DescriptionContainer>
                    <Description>{props.description || 'No description.'}</Description>
                </DescriptionContainer>
                <BottomInfoRow>
                    <BottomInfoCont>
                        <OwnerContainer
                            onClick={() => window.open(props.owner.url, '_blank')}
                        >
                            <OwnerIcon />
                            <Owner>{props.owner?.name}</Owner>
                        </OwnerContainer>
                        <ScheduledMenu />
                    </BottomInfoCont>
                    <BackupButtonCont>
                        <BackupButton
                            onClick={openBackupModal}
                            style={{
                                borderRadius: 10
                            }}
                        >
                            Backup
                        </BackupButton>
                    </BackupButtonCont>
                </BottomInfoRow>
            </TextContainer>
            <StyledDialog
                open={modalOpened}
                onClose={onClosedModal}
            >
                <DialogContainer>
                    <DialogTitle>Create Backup</DialogTitle>
                    <DialogContent>
                        <BackupNameTextField
                            placeholder="Optional backup name"
                            // @ts-ignore
                            onChange={ (e) => { setBackupName(e.target.value)} }
                        />
                        <SubmitButtonCont>
                            <SubmitButton
                                onClick={() => submitBackup()}
                            >Submit</SubmitButton>
                        </SubmitButtonCont>
                    </DialogContent>
                </DialogContainer>
            </StyledDialog>
            <UpgradeNeededDialog
                showDialog={showUpgradeDialog}
                setShowDialog={(showDialog: boolean) => setShowUpgradeDialog(showDialog)} />
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    flex-direction: row;
    padding: 1em;
    padding-bottom: .5em;
    cursor: default;
`;

const ImageContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Image = styled.img`
    width: 12em;
    height: 12em;
    object-fit: cover;
`;

const PlatformContainer = styled.div`

`;

const Platform = styled.text`
    text-transform: uppercase;
    font-weight: lighter;
`;

const TextContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: .5em;
    width: 100%;
`;

const TitleContainer = styled.div`

`;

const Title = styled.h3`
    cursor: pointer;
    margin-top: .1em;
`;

const DescriptionContainer = styled.div`
    flex-grow: 1;
`;

const Description = styled.text`
    font-size: 12px;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
`;

const BottomInfoRow = styled(Row)`

`;

const BottomInfoCont = styled(Column)`

`;

/**
 * Styling for this component uses "useStyles" above. Material-UI styled-components 
 * needs some work.
 */
const StyledSelect = styled(Select)``;

const OwnerContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-top: .5em;
    flex-grow: 1;
    cursor: pointer;
`;

const OwnerIcon = styled(IoMdPerson)`
    font-size: 1.5em;
`;

const Owner = styled.text`

`;

const ScheduledContainer = styled.div`

`;

const ScheduledCheckContainer = styled.div`

`;

const ScheduledCheckbox = styled(Checkbox)`

`;

const ScheduledFormLabel = styled(FormControlLabel)`
    min-height: 3em;
`;

const BackupButtonCont = styled.div`
    display: flex;
    flex-direction: column-reverse;
`;

const BackupButton = styled(Button)`
    background-color: ${colors.PRIMARY_ACCENT};
    padding-top: .5em;
    padding-left: 1em;
    padding-right: 1em;
    font-size: 18px;
    font-weight: bold;
    max-height: 2.5em;

    &:hover {
        background-color: ${colors.SECONDARY_ACCENT};
    }
`;

const StyledDialog = styled(Dialog)`
`;

const DialogContainer = styled.div`
    width: 20em;
    align-items: center;
    background-color: ${colors.LIGHT};
`;

const BackupNameTextField = styled(TextField)`
    width: 100%;
`;

const SubmitButtonCont = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
`;

const SubmitButton = styled(Button)`
    background-color: ${colors.PRIMARY_ACCENT};
    margin: 1em;
    padding-left: 1em;
    padding-right: 1em;
    font-size: 18px;
    font-weight: bold;

    &:hover {
        background-color: ${colors.SECONDARY_ACCENT};
    }
`;

export default Info

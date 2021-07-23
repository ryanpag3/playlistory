import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { IoMdPerson } from 'react-icons/io';
import { Button, Checkbox, Dialog, DialogContent, DialogTitle, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField, Tooltip } from '@material-ui/core';
import colors from '../../constants/colors';
import axios from 'axios';

const Info = (props: any) => {

    console.log(props);

    const [modalOpened, setModalOpened] = useState(false);
    const [interval, setInterval] = useState(props.scheduledBackup ? props.scheduledBackup.interval : 'day');
    const [scheduledChecked, setScheduledChecked] = useState(props.scheduledBackup !== undefined ? true : false);

    useEffect(() => {
        if (scheduledChecked === false) {
            cleanupScheduledBackups();
        } else if (interval) {
            submitBackup();
        }
    }, [ scheduledChecked, interval ]);

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

    async function submitBackup() {
        await axios.post('/backup', {
            playlistId: props.id,
            platform: props.platform,
            interval: scheduledChecked === true ? interval : undefined
        });
        props.triggerRefetch();
        setModalOpened(false);
    }

    async function openBackupModal() {
        setModalOpened(true);

    }

    function onClosedModal() {
        setModalOpened(false);
    }

    return (
        <Container>
            <ImageContainer>
                <Image src={props.imageUrl}/>
            </ImageContainer>
            <TextContainer>
                <PlatformContainer>
                    <Platform>
                        {props.platform}
                    </Platform>
                </PlatformContainer>
                <TitleContainer>
                    <Title>{props.name}</Title>
                </TitleContainer>
                <DescriptionContainer>
                    <Description>{props.description || 'No description.'}</Description>
                </DescriptionContainer>
                <Row>
                    <BottomInfoCont>
                        <OwnerContainer>
                            <OwnerIcon/>
                            <Owner>{props.owner?.name}</Owner>
                        </OwnerContainer>
                        <ScheduledContainer>
                            <FormControlLabel
                                control={
                                    <ScheduledCheckbox
                                        checked={scheduledChecked}
                                        onChange={(e) => setScheduledChecked(e.target.checked)}
                                    />
                                }
                                label="Scheduled"
                            />
                            {
                            scheduledChecked && 
                            <FormControl>
                                <Tooltip title="Backups always start at the top of the interval. For example, every week would be on Sunday at 12am PST. Every day would be 12am PST, etc.">
                                    <InputLabel id="interval-label">Interval</InputLabel>
                                </Tooltip>
                                <Select
                                    labelId="interval-label"
                                    value={interval}
                                    onChange={handleIntervalChange}
                                >
                                    <MenuItem value="hour">Once per hour</MenuItem>
                                    <MenuItem value="day">Once per day</MenuItem>
                                    <MenuItem value="week">Once per week</MenuItem>
                                    <MenuItem value="month">Once per month</MenuItem>
                                    <MenuItem value="year">Once per year</MenuItem>
                                </Select>
                            </FormControl>
                            }
                        </ScheduledContainer>
                    </BottomInfoCont>
                    <BackupButton
                        onClick={openBackupModal}
                    >
                        Backup
                    </BackupButton>
                </Row>
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
                        />
                        <SubmitButtonCont>
                            <SubmitButton
                                onClick={submitBackup}
                            >Submit</SubmitButton>
                        </SubmitButtonCont>
                    </DialogContent>
                </DialogContainer>
            </StyledDialog>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    flex-direction: row;
    padding: 1em;
    padding-bottom: .5em;
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

const BottomInfoCont = styled(Column)``;

const OwnerContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-top: .5em;
    flex-grow: 1;
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

`;

const BackupButton = styled(Button)`
    background-color: ${colors.PRIMARY_ACCENT};
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

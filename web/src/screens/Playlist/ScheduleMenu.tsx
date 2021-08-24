import React, { useEffect, useState } from 'react'
import { MenuItem, Select, withStyles } from '@material-ui/core';
import styled from 'styled-components';
import colors from '../../constants/colors';
import { useHistory } from 'react-router-dom';
import axios from '../../util/axios';
import ColorsNew from '../../constants/colors-new';

const ScheduleMenu = (props: {
    id: string;
    platform: string;
    isScheduled: boolean;
}) => {
    const history = useHistory();
    const [interval, setInterval] = useState("day");

    useEffect(() => {
        if (props.isScheduled === true)
            submitBackup();
    }, [ props.isScheduled, interval ]);

    async function submitBackup() {
        try {
            await axios.post('/backup', {
                playlistId: props.id,
                platform: props.platform,
                interval: interval
            });
        } catch (e) {
            history.replace('/error');
        }
    }

    function handleIntervalChange(changed: any) {
        setInterval(changed.target.value);
    }

    return (
        <Container>
            <StyledSelect
                labelId="interval-label"
                value={interval}
                onChange={handleIntervalChange}
            >
                <MenuItem value="hour">Once per hour</MenuItem>
                <MenuItem value="day">Once per day</MenuItem>
                <MenuItem value="week">Once per week</MenuItem>
                <MenuItem value="month">Once per month</MenuItem>
                <MenuItem value="year">Once per year</MenuItem>
            </StyledSelect>
        </Container>
    )
}

const Container = styled.div`

`;

const StyledSelect = withStyles({
    select: {
        color: `${ColorsNew.LIGHT} !important`,
        '&:before': {
            borderColor: ColorsNew.LIGHT
        },
        '&:after': {
            borderColor: colors.LIGHT
        }
    },
    label: {
        color: `${ColorsNew.LIGHT} !important`
    }
})(Select);

export default ScheduleMenu;

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import BackupListRow from './BackupListRow';

const BackupList = () => {
    const [isInit, setIsInit] = useState(false);
    const [backups, setBackups] = useState([] as any);

    useEffect(() => {
        if (isInit)
            return;
        fetchBackups();        
    }, [ isInit === false ])

    async function fetchBackups(offset: number = 0) {
        const { data } = await axios({
            method: 'get',
            url: '/backup/scheduled'
        });
        setBackups(data);
    }

    return (
        <Container>
            { backups.map((b: any) => <BackupListRow { ...b }/>)}
        </Container>
    )
}

const Container = styled.div`
    width: 100%;
    max-width: 35em;
`;

export default BackupList;

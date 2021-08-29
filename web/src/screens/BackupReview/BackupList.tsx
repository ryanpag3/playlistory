import axios from 'axios';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components';

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
            { backups.map((b: any) => <div>{JSON.stringify(b)}</div>)}
        </Container>
    )
}

const Container = styled.div`

`;

export default BackupList;

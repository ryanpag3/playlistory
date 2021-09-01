import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react'
import styled from 'styled-components';
import ColorsNew from '../../constants/colors-new';
import BackupListRow from './BackupListRow';

const BackupList = () => {
    const [isInit, setIsInit] = useState(false);
    const [backups, setBackups] = useState([] as any);

    useEffect(() => {
        if (isInit)
            return;
        fetchBackups();
    }, [isInit === false])

    async function fetchBackups(offset: number = 0) {
        const { data } = await axios({
            method: 'get',
            url: '/backup/scheduled'
        });
        setBackups(data);
    }

    // placeholder to identify first new type in the array
    let prevBackup: any;

    return (
        <Container>
            {backups.map((b: any) => {
                let displayStatusId = false;
                if (prevBackup?.status !== b.status) {
                    displayStatusId = true;
                }
                prevBackup = b;
                return (
                    <RowContainer>
                        {
                            displayStatusId &&
                            <FirstStatusId>{b.status.toLowerCase()}</FirstStatusId>
                        }
                        <BackupListRow {...b} displayStatusId={displayStatusId} />
                    </RowContainer>
                )
            })}
        </Container>
    )
}

const Container = styled.div`
    width: 100%;
    max-width: 35em;
`;

const RowContainer = styled.div`
    display: flex;
    flex-direction: row;
    position: relative;
`;

const FirstStatusId = styled.div`
    position: absolute;
    top: 20px;
    left: -95px;
    color: ${ColorsNew.LIGHT};
    opacity: 0.5;
    font-weight: lighter;
    text-align: center;
`;

export default BackupList;

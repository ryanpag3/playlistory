import React, { useState } from 'react'
import styled from 'styled-components';
import NavBar from '../../components/NavBar';
import Screen from '../../components/Screen';
import BackupList from './BackupList';

const BackupReview = () => {

    return (
        <Container>
            <NavBar/>
            <BackupList/>
        </Container>
    )
}

const Container = styled(Screen)`

`;

export default BackupReview;

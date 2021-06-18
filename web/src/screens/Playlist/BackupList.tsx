import useAxios from 'axios-hooks';
import React, { useEffect } from 'react'
import styled from 'styled-components';

const BackupList = (props: any) => {
    const [{ data, loading, error}, refetch] = useAxios({
        method: 'GET',
        url: '/backup',
        params: {
            id: props.id
        }
    });

    useEffect(() => {
        console.log(data);
    }, [ data ])

    return (
        <Container>
            
        </Container>
    )
}

const Container = styled.div`

`;

export default BackupList


import { Divider } from '@material-ui/core';
import React, { Fragment } from 'react'
import styled from 'styled-components';
import colors from '../../constants/colors';

const PlaylistRow = (props: any) => {
    console.log(props);
    return (
        <ParentContainer>
            <Container>
                <ImageContainer>
                    <Image src={props.imageUrl}/>
                </ImageContainer>
            </Container>
            <StyledDivider/>
        </ParentContainer>
    )
}

const ParentContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const Container = styled.div`
    display: flex;
    flex-direction: row;
    padding-top: .1em;
    padding-bottom: .1em;
    background-color: ${colors.LIGHT};
    width: 100%;
`;

const ImageContainer = styled.div`
    flex-grow: 1;
`;

const Image = styled.img`
    width: 3em;
    height: 3em;
    border-radius: 1.5em;
`;

const StyledDivider = styled(Divider)`
    width: 100%;
`;

export default PlaylistRow

import React from 'react'
import styled from 'styled-components';

const BackupDiffTrackRow = (props: any) => {
    return (
        <Container>
            <ImageContainer>
                <Image src={props.imageUrl} />
            </ImageContainer>
            <InfoContainer>
                <SongTitle>
                    {props.name}
                </SongTitle>
                <SubInfoContainer>
                    <ArtistsNames>
                        {props.artists.map((a: any) => a.name).join(', ')}
                    </ArtistsNames>
                    &nbsp; • &nbsp;
                    <AlbumName>
                        {props.albumName}
                    </AlbumName>
                </SubInfoContainer>
            </InfoContainer>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: .35em;
`;

const ImageContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Image = styled.img`
    width: 3em;
    overflow: hidden;
    border-radius: .25em;
`;

const InfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: .5em;
`;

const SongTitle = styled.div`

`;

const SubInfoContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

const ArtistsNames = styled.div`
    max-width: 30%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const AlbumName = styled.div`
    max-width: 30%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export default BackupDiffTrackRow;

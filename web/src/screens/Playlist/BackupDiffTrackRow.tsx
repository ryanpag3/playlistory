import React, { useState } from 'react'
import styled from 'styled-components';
import Marquee from "react-fast-marquee";

const BackupDiffTrackRow = (props: any) => {
    const [marqueeArtistName, setMarqueeArtistName] = useState(false);
    const [marqueeAlbumName, setMarqueeAlbumName] = useState(false);

    return (
        <Container>
            <ImageContainer>
                <Image src={props.imageUrl} />
            </ImageContainer>
            <InfoContainer>
                <SongTitle
                    onClick={() => window.open(props.url, '_blank')}
                >
                    {props.name}
                </SongTitle>
                <SubInfoContainer>
                    <div
                        onMouseEnter={() => setMarqueeArtistName(true)}
                        onMouseLeave={() => setMarqueeArtistName(false)}
                    >
                        <StyledArtistMarquee
                            gradient={false}
                            play={marqueeArtistName}
                        >
                            <ArtistsNames>
                                {props.artists.map((a: any) => a.name).join(', ')} &nbsp;
                            </ArtistsNames>
                        </StyledArtistMarquee>
                        
                    </div>
                    &nbsp; • &nbsp;
                    <div
                        onMouseEnter={() => setMarqueeAlbumName(true)}
                        onMouseLeave={() => setMarqueeAlbumName(false)}
                    >
                        <StyledAlbumNameMarquee
                            gradient={false}
                            play={marqueeAlbumName}
                        >
                            <AlbumName>
                                {props.albumName}
                            </AlbumName>
                        </StyledAlbumNameMarquee>
                    </div>
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
    cursor: default;
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
    flex-grow: 1;
    margin-bottom: .5em;
    font-weight: lighter;
    cursor: pointer;
`;

const SubInfoContainer = styled.div`
    display: flex;
    flex-direction: row;
    max-width: 33em;
    font-size: .9em;
`;

const StyledArtistMarquee = styled(Marquee)`
    max-width: 7em;
`;

const ArtistsNames = styled.div`
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const StyledAlbumNameMarquee = styled(Marquee)`
    max-width: 20em;
`;

const AlbumName = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export default BackupDiffTrackRow;

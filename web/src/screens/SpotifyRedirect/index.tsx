import React, { useEffect } from 'react'
import styled from 'styled-components';
import Screen from '../../components/Screen';
import colors from '../../constants/colors';
import { useQuery } from '../../util/query';


const SpotifyRedirect = () => {
    const query = useQuery();
    
    useEffect(() => {
        console.log(query.getAll(''));
    });

    return (
        <StyledScreen>
            You may close this window.
        </StyledScreen>
    )
}

const StyledScreen = styled(Screen)`
    color: ${colors.LIGHT};
`;

export default SpotifyRedirect

import axios from '../../util/axios';
import React, { useEffect } from 'react'
import styled from 'styled-components';
import Screen from '../../components/Screen';
import colors from '../../constants/colors';
import { useQuery } from '../../util/query';


const SpotifyRedirect = () => {
    const query = useQuery();
    
    useEffect(() => {
        console.log(query.get('code'));
        const code = query.get('code');
        if (code) {
            finishAuth(code)
                .then(() => {
                    window.close();
                });
        }
    });

    async function finishAuth(code: string) {
        const res = await axios('/spotify', {
            method: 'POST',
            data: {
                token: code
            } as any,
            headers: {
                'content-type': 'application/json'
            }
        });
        return res;
    }

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

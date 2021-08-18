import styled from 'styled-components';

import React from 'react'
import colors from '../constants/colors';

const BetaBadge = (props: any) => {
    return (
        <BetaBadgeContainer>
            <BetaBadgeImpl
                {...props}
            >
                BETA
            </BetaBadgeImpl>
        </BetaBadgeContainer>
    )
}

const BetaBadgeContainer = styled.div`
    cursor: default;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const BetaBadgeImpl = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    background-color: ${colors.TERTIARY_ACCENT};
    padding: .25em;
    padding-top: .35em;
    margin-left: .5em;
    border-radius: 4px;
    font-size: .8em;
    font-weight: bold;
    border: thin solid ${colors.LIGHT};
    color: ${colors.LIGHT};
`;

export default BetaBadge;

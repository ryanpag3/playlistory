/* 
 * Copyright (C) Ryan Page - All Rights Reserved
 * For more information, refer to LICENSE file.
 */
import React from 'react'
import styled from 'styled-components';
import colors from '../../constants/colors';

const AccountTierBox = (props: {
    accountTitle: string;
    features: string[];
    price?: string;
    SubmitButton?: any;
    buttonText?: string;
    onSubmit?: () => void;
}) => {
    return (
        <Container>
            <AccountTitleContainer>
                <AccountTitle>
                    {props.accountTitle}
                </AccountTitle>
            </AccountTitleContainer>
            {
                props.price && 
                <PriceContainer>
                    <Price>{props.price}</Price>
                </PriceContainer>
            }
            <FeaturesList>
                {
                    props.features.map((feature) => {
                        return <Feature>{feature}</Feature> 
                    })
                }
            </FeaturesList>
            {
                props.SubmitButton &&
                <SubmitButtonContainer>
                    <props.SubmitButton
                        // @ts-ignore
                        onClick={() => props.onSubmit()}
                    >{props.buttonText}</props.SubmitButton>
                </SubmitButtonContainer>
            }
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    background: ${colors.LIGHT};
    border: 1px solid black;
    width: 25em;
`;

const AccountTitleContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const AccountTitle = styled.h2`

`;

const FeaturesList = styled.ul`

`;

const Feature = styled.li`
    margin-bottom: .4em;
`;

const PriceContainer = styled.div`
    display: flex;
    justify-content: center;
    color: ${colors.MEDIUM_DARK};
`;

const Price = styled.text`

`;

const SubmitButtonContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    padding-bottom: 1.5em;
`;

export default AccountTierBox;

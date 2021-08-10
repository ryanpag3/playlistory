import React, { useState } from 'react'
import { Input, TextField } from '@material-ui/core';
import styled from 'styled-components';
import colors from '../../constants/colors';
import SettingHeader from './SettingHeader';

const UpdateEmailSetting = (props: any) => {

    return (
        <Container>
            <SettingHeader
                title="Update Email"
            />
            <InputContainer>
                <StyledInput
                    placeholder="email"
                    style={{ color: 'white' }}
                    onChange={(t: any) => {
                        props?.setEmail(t.target.value);
                    }}
                />
            </InputContainer>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

const InputContainer = styled.div`
    display: flex;
`;

const StyledInput = styled(TextField)`
    min-width: 20em;
    color: ${colors.LIGHT};

    .MuiInput-root {
        color: ${colors.PRIMARY_ACCENT};
    }

    & ::placeholder {
        color: white !important;
    }

    /* default */
    .MuiInput-underline:before {
        border-bottom: 2px solid ${colors.MEDIUM};
    }
    /* hover (double-ampersand needed for specificity reasons. */
    && .MuiInput-underline:hover:before {
        border-bottom: 2px solid ${colors.SECONDARY_ACCENT};
    }
    /* focused */
    .MuiInput-underline:after {
        border-bottom: 2px solid ${colors.MEDIUM};
    }
`;

export default UpdateEmailSetting

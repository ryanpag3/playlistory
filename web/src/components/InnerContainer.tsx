import styled from 'styled-components';
import colors from '../constants/colors';

const InnerContainer = styled.div`
    min-width: 700px;
    max-width: 50vw;
    flex-grow: 1;
    background-color: ${colors.MEDIUM};
`;

export default InnerContainer;
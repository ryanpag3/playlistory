import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    body > #root > div {
        height: 100vh;
    }

    body {
        padding: 0;
        margin: 0;
    }
`;

export default GlobalStyle;
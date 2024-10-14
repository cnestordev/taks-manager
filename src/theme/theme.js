// theme.js
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
    components: {
        Button: {
            baseStyle: {
                padding: '5px 12px',
                lineHeight: '1.2',
                borderRadius: '50px',
                fontWeight: '500',
                minWidth: '80px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease, color 0.2s ease',
            },
        },
        Toast: {
            defaultProps: {
                position: 'top-center',
                duration: 5000,
                isClosable: true,
            },
        },
    },
});

export default theme;

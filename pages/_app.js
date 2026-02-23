import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { wagmiConfig } from '../wagmiConfig';

const queryClient = new QueryClient();

const bloomTheme = darkTheme({
    accentColor: '#ff6ec7',
    accentColorForeground: '#fff',
    borderRadius: 'large',
    fontStack: 'system',
    overlayBlur: 'large',
});

export default function App({ Component, pageProps }) {
    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider theme={bloomTheme} modalSize="compact">
                    <Component {...pageProps} />
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}

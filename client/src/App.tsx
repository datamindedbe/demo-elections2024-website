import { AppRoutes } from '@/routes.tsx';
import { Container } from '@/components/layout/container/container.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const ONE_HOUR = 1000 * 60 * 60;
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: ONE_HOUR,
            refetchOnWindowFocus: false,
            staleTime: ONE_HOUR,
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Container variant={'application'}>
                <AppRoutes />
            </Container>
        </QueryClientProvider>
    );
}

export default App;

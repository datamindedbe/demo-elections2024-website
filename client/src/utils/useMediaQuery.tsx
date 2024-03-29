import { useEffect, useState } from 'react';

export const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState<boolean>(() => window.matchMedia(query).matches);

    useEffect(() => {
        const mediaQueryList: MediaQueryList = window.matchMedia(query);

        const documentChangeHandler = (event: MediaQueryListEvent) => setMatches(event.matches);

        mediaQueryList.addEventListener('change', documentChangeHandler);
        return () => mediaQueryList.removeEventListener('change', documentChangeHandler);
    }, [query]);

    return matches;
};

import { useRouter } from 'found';
import { useState } from 'react';

// This hook idea was borrowed from this article
// https://gal.hagever.com/posts/react-forms-and-history-state
// It's used to store state when refreshing or clicking back
const useHistoryState = (key, initialValue) => {
    const { router, match } = useRouter();
    const {location} = match;
    const [rawState, rawSetState] = useState(() => (location.state && location.state[key]) || initialValue);
    const setState = (value) => {
        router.replace({
            ...location,
            state: {
                ...location.state,
                [key]: value
            }
        });
        rawSetState(value);
    };
    return [rawState, setState];
};

export {useHistoryState};
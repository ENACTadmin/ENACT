// Filename: hooks/useDebounce.js

import { useState, useEffect } from 'react';

function useDebounce(value, delay) {
    // State to store debounced value
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Set debouncedValue to value (passed in) after the specified delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Return a cleanup function that will be called every time useEffect is re-called.
        // useEffect will only be re-called if value or delay changes (see the second parameter to useEffect).
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // Only re-call effect if value or delay changes

    return debouncedValue;
}

export default useDebounce;

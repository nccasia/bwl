/* eslint-disable prettier/prettier */
import React from "react";

export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = React.useState(value);
  
    React.useEffect(() => {
      const timerId = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
  
      return () => {
        clearTimeout(timerId);
      };
    }, [value, delay]);
  
    return debouncedValue;
}

export function useDataDebouncer(initialData, delay) {
    const debouncedData = useDebounce(initialData, delay);
    return debouncedData;
  }
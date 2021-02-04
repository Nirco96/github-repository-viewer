import {useEffect, useRef, useState} from "react";

interface Options {
  callback: () => Promise<unknown>;
  element: HTMLElement | null;
  disabled: boolean;
}

export const useInfiniteScroll = ({ callback, element, disabled }: Options) => {
  const [isFetching, setIsFetching] = useState(false);
  const observer = useRef<IntersectionObserver>();

  useEffect(() => {
    if (!element || disabled) {
      return;
    }

    observer.current = new IntersectionObserver((entries) => {
      if (!isFetching && entries[0].isIntersecting) {
        setIsFetching(true);
        callback().finally(() => setIsFetching(false));
      }
    });
    observer.current.observe(element);

    return () => observer.current?.disconnect();
  }, [callback, isFetching, element, disabled]);

  return isFetching;
};
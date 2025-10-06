import { useEffect, useRef } from "react";

export function useAnimateOnScroll(animation: string = "fade-up", options: IntersectionObserverInit = { threshold: 0.1 }) {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        const handleIntersect = (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    node.classList.add("animate-" + animation);
                    node.classList.remove("opacity-0", "translate-y-8");
                }
            });
        };
        const observer = new window.IntersectionObserver(handleIntersect, options);
        observer.observe(node);
        return () => observer.disconnect();
    }, [animation, options]);

    return ref;
}

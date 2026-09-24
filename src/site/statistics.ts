import { statisticsVendors } from "./vendors";

export function initStatistics(options: {
  colorCircle: string;
  threshold: number;
  minimumRatio: number;
}): void {
  const { countUp, CircularProgressBar } = statisticsVendors();
  const stats = [
    ["institutes", 17],
    ["cxos", 2000],
    ["speakers", 300],
    ["partners", 200],
  ] as const;
  const effects = stats.map(([name, value]) => {
    const counter = new countUp.CountUp(`stat-${name}`, value, { duration: 1 });
    const circle = new CircularProgressBar(`stat-circle-${name}`, {
      colorSlice: "#0284C7",
      colorCircle: options.colorCircle,
      stroke: 5,
      round: true,
      number: false,
      size: 120,
      speed: 120,
    });
    return () => {
      circle.initial();
      counter.start();
    };
  });
  const cards = Array.from(document.querySelectorAll(".stats-cards"));
  if (typeof window.IntersectionObserver === "function") {
    const observer = new IntersectionObserver(
      (entries, activeObserver) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= options.minimumRatio) {
            effects.forEach((effect, index) =>
              index === 0 ? effect() : setTimeout(effect, index * 500),
            );
            activeObserver.unobserve(entry.target);
          }
        }
      },
      { root: null, rootMargin: "0px", threshold: options.threshold },
    );
    cards.forEach((card) => observer.observe(card));
  } else {
    cards.forEach(() => effects.forEach((effect) => effect()));
  }
}

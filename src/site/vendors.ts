// Page snippets retain their existing external vendor scripts; these narrow
// interfaces describe only APIs used by our first-party code.
export interface SwiperOptions {
  a11y?: { slideRole: string };
  spaceBetween?: number;
  slidesPerView?: number;
  slidesPerGroup?: number;
  preloadImages?: boolean;
  enabled?: boolean;
  grabCursor?: boolean;
  simulateTouch?: boolean;
  pagination?: { el: string; clickable: boolean };
  navigation?: { nextEl: string; prevEl: string };
  grid?: { fill: string; rows: number };
  breakpoints?: Record<number, SwiperOptions>;
}
export type SwiperConstructor = new (selector: string, options: SwiperOptions) => object;
export interface CountUpInstance {
  start(): void;
}
export interface CircleInstance {
  initial(): void;
}
export interface StatisticsVendors {
  countUp: {
    CountUp: new (id: string, value: number, options: { duration: number }) => CountUpInstance;
  };
  CircularProgressBar: new (
    id: string,
    options: {
      colorSlice: string;
      colorCircle: string;
      stroke: number;
      round: boolean;
      number: boolean;
      size: number;
      speed: number;
    },
  ) => CircleInstance;
}
type VendorWindow = Window &
  Partial<StatisticsVendors> & {
    Swiper?: SwiperConstructor;
  };
export function swiper(): SwiperConstructor {
  const value = (window as VendorWindow).Swiper;
  if (!value) throw new Error("IPMI page bundle requires Swiper 8 to load first.");
  return value;
}
export function statisticsVendors(): StatisticsVendors {
  const { countUp, CircularProgressBar } = window as VendorWindow;
  if (!countUp || !CircularProgressBar)
    throw new Error("IPMI statistics require CountUp and CircularProgressBar.");
  return { countUp, CircularProgressBar };
}

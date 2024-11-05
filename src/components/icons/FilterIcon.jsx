import { forwardRef } from "react";

const FilterIcon = forwardRef(({ size }, ref) => (
  <svg
    ref={ref}
    title="Filter Icon"
    aria-label="filter"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    fill="#000000"
    className="bi bi-filter"
    viewBox="0 0 16 16"
    id="Filter--Streamline-Bootstrap"
    height={16}
    width={16}
  >
    <desc>{"Filter Streamline Icon: https://streamlinehq.com"}</desc>
    <path
      d="M6 10.5a0.5 0.5 0 0 1 0.5 -0.5h3a0.5 0.5 0 0 1 0 1h-3a0.5 0.5 0 0 1 -0.5 -0.5m-2 -3a0.5 0.5 0 0 1 0.5 -0.5h7a0.5 0.5 0 0 1 0 1h-7a0.5 0.5 0 0 1 -0.5 -0.5m-2 -3a0.5 0.5 0 0 1 0.5 -0.5h11a0.5 0.5 0 0 1 0 1h-11a0.5 0.5 0 0 1 -0.5 -0.5"
      strokeWidth={1}
    />
  </svg>
));
FilterIcon.displayName = "FilterIcon";
export default FilterIcon;

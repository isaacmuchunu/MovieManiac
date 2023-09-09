import React from "react";

const FilterRating = (props) => {
  const { filterRating, onRatingClick } = props;
  return (
    <ul className="text-gray-200 flex items-center space-x-2">
      <li
        className={
          filterRating === 8
            ? "border rounded-md border-blue-500 px-2"
            : "border rounded-md px-2 "
        }
        onClick={() => onRatingClick(8)}
      >
        8+ Star
      </li>
      <li
        className={
          filterRating === 7
            ? "border rounded-md border-blue-500 px-2"
            : "border rounded-md px-2 "
        }
        onClick={() => onRatingClick(7)}
      >
        7+ Star
      </li>
      <li
        className={
          filterRating === 6
            ? " border rounded-md border-blue-500 px-2"
            : "border rounded-md px-2 "
        }
        onClick={() => onRatingClick(6)}
      >
        6+ Star
      </li>
    </ul>
  );
};

export default FilterRating;

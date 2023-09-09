import React from "react";

const FilterRating = (props) => {
  const { filterRating, onRatingClick, ratings } = props;
  return (
    <ul className="text-gray-200 flex items-center space-x-2">
      {ratings.map((rate) => (
        <li
        key={rate}
          className={
            filterRating === rate
              ? "border rounded-md border-blue-500 px-2"
              : "border rounded-md px-2 "
          }
          onClick={() => onRatingClick(rate)}
        >
          {rate}+ Star
        </li>
      ))}
    </ul>
  );
};

export default FilterRating;

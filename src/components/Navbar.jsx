import React from "react";
import Fire from "../assets/fire.png";
import Star from "../assets/glowing-star.png";
import Party from "../assets/partying-face.png";
import DarkMode from "./DarkMode"



const Navbar = () => {
  return (
    <div className=" text-gray-100 py-8 px-4 flex items-center justify-between font-poppins border-b-2 border-gray-500 ">
      <div className="text-2xl font-semibold">
        <h1>MovieManiac</h1>
      </div>
      <div className="flex space-x-4">
        <DarkMode/>
        <a href="#popular" className="flex items-center space-x-1">
          <img src={Fire} alt="fire" className="h-4 w-4" />
          <span>Popular</span>
        </a>
        <a href="#top_rated" className="flex items-center space-x-1">
          <img src={Star} alt="star" className="h-4 w-4" />
          <span>Top Rated</span>
        </a>
        <a href="#upcoming" className="flex items-center space-x-1">
          <img src={Party} alt="party" className="h-4 w-4" />
          <span>Upcoming</span>
        </a>
      </div>
    </div>
  );
};

export default Navbar;

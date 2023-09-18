import Fire from "../assets/fire.png";
import Star from "../assets/glowing-star.png";
import Party from "../assets/partying-face.png";
import DarkMode from "./DarkMode";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div className=" text-gray-100 py-8 px-4 flex items-center justify-between font-poppins border-b-2 border-gray-500 ">
      <div className="text-2xl font-semibold">
        <h1>MovieManiac</h1>
      </div>
      <div className="flex space-x-4">
        <DarkMode />
        <NavLink
          to="/"
          className="flex items-center space-x-1 active:font-bold"
        >
          <img src={Fire} alt="fire" className="h-4 w-4" />
          <span>Popular</span>
        </NavLink>
        <NavLink
          to="/top_rated"
          className="flex items-center space-x-1 active:font-bold"
        >
          <img src={Star} alt="star" className="h-4 w-4" />
          <span>Top Rated</span>
        </NavLink>
        <NavLink
          to="/upcoming"
          className="flex items-center space-x-1 active:font-bold"
        >
          <img src={Party} alt="party" className="h-4 w-4" />
          <span>Upcoming</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;

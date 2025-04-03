import React from "react";
import "../pages.css";
import Mainprofile from "./Mainprofile/Mainprofile";
import { useUserAuth } from "../../context/UserAuthContext";
import LocationTracker from "../../components/LocationTracker";
const Profile = () => {
  const { user } = useUserAuth();
  // const user = {
  //   displayname: "bithead",
  //   email: "bithead@gmail.com",
  // };
  
  return (
    <div className="profilePage">
      <Mainprofile user={user} />
      <LocationTracker />
    </div>
  );
};

export default Profile;

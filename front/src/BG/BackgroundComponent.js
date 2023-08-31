import React from "react";
import "./BackgroundComponent.css";

function BackgroundComponent({ children }) {
  return (
    <div className="background-svg">
      <img
        className="MOGGOZI_GREEN"
        src="/background/background1.svg"
        alt="Background 1"
      />
      <img
        className="MOGGOZI_PUPLE"
        src="/background/background2.svg"
        alt="Background 2"
      />
      {children}
    </div>
  );
}

export default BackgroundComponent;

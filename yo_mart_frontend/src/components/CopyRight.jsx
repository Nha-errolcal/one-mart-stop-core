import React from "react";

const CopyRight = () => {
  return (
    <>
      <p
        style={{
          position: "absolute",
          bottom: 24,
          color: "rgba(255,255,255,0.2)",
          fontSize: 11,
          fontFamily: "monospace",
          zIndex: 1,
          textAlign: "center",
        }}
      >
        © {new Date().getFullYear()} Mat Van Stop KH · All rights reserved by{" "}
        <span className="text-white underline hover:text-gray-400 transition-all ease-in-out">
          <a href="https://teamyearng.com" target="_blank">
            teamyearng
          </a>
        </span>
      </p>
    </>
  );
};

export default CopyRight;

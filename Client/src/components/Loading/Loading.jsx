import React from "react";

const Loading = () => {
  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
      <h1 style={styles.text}>Loading, please wait...</h1>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    background: "linear-gradient(135deg, #ff6a00, #ee0979, #6a11cb, #2575fc)",
    backgroundSize: "400% 400%",
    animation: "gradientBG 15s ease infinite",
    color: "#fff",
    fontFamily: "'Arial', sans-serif",
    overflow: "hidden",
  },
  spinner: {
    width: "80px",
    height: "80px",
    border: "8px solid rgba(255, 255, 255, 0.3)",
    borderTop: "8px solid #fff",
    borderRadius: "50%",
    animation: "spin 1.5s linear infinite, gradientBorder 3s ease-in-out infinite",
    marginBottom: "20px",
  },
  text: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    textShadow: "0 0 10px rgba(255,255,255,0.5)",
  },
};

// Create keyframes using a style tag
const style = document.createElement("style");
style.innerHTML = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes gradientBG {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes gradientBorder {
  0% { border-top-color: #fff; }
  50% { border-top-color: #ff0; }
  100% { border-top-color: #fff; }
}
`;
document.head.appendChild(style);

export default Loading;

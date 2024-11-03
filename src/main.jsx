import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MathJaxContext } from "better-react-mathjax";

import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MathJaxContext
      config={{
        loader: { load: ["input/asciimath"] },
        asciimath: {
          displaystyle: true,
        },
      }}
    >
      <App />
    </MathJaxContext>
  </StrictMode>
);

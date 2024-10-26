import ReactDOM from "react-dom/client";
import App from "./App";
import { getCategories } from "./services/category-service";

// body에 div 추가 후 div에 <App /> 렌더
const rootElement = document.createElement("div");
document.body.appendChild(rootElement);
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);

getCategories().then(console.log);
fetch("/api/categories")
  .then((data) => data.text())
  .then(console.log);

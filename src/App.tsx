import "./App.css";
import { Button } from "./components/ui/button";

function App() {
  return (
    <>
      <Button onClick={() => alert("Hello")}>Click Me</Button>
    </>
  );
}

export default App;

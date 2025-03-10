import { useState } from "react";
import { Button } from "./components/ui/button";

function App() {
  const [status, setStatus] = useState(false);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Button
        variant={"destructive"}
        onClick={() => setStatus((prev) => !prev)}
      >
        Arpan is {status ? "not here" : "here"}
      </Button>
    </div>
  );
}

export default App;

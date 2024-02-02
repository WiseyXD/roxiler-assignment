import { useEffect } from "react";
import useFetchName from "./hooks/useFetchName";

function App() {
    const name = useFetchName();

    return <>{name}</>;
}

export default App;

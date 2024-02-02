import { useState, useEffect } from "react";

const fetchFromBackend = async () => {
    const response = await fetch("http://localhost:8000/");
    const data = await response.json();
    const { name } = data;
    return name;
};

export default function useFetchName() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedData = await fetchFromBackend();
                setData(fetchedData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return data;
}

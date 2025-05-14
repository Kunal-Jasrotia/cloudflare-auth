import { useEffect, useState } from "react";
function App() {
  const [data, setData] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/api/test");
        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`);
        }
        const data: { message: string } = await response.json();
        console.log(data);

        setData(data.message);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
    loadData();
  }, []);

  return (
    <div>
      <h1>Upp and running</h1>
      {data && <p>{data}</p>}
    </div>
  );
}

export default App;

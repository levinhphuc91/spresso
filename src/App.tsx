import { useState, useEffect } from "react";

import { DataType } from "./types/index.ts";
import Table from "./components/Table/Table.tsx";
import TableConfig from "./config/Table.ts";
import { POST_API } from "./contants.ts";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataType[]>([]);

  useEffect(() => {
    setLoading(true);
    fetch(POST_API)
      .then(async (res) => {
        const data = await res.json();
        setData(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold">Posts table</h1>
      <Table config={TableConfig} rawData={data} loading={loading} />
    </div>
  );
};

export default App;

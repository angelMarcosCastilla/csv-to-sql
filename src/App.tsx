import React from "react";

const getSqlString = (data: string, separator = ",") => {
  const lines = data.split("\n").map((line) => line.replace("\r", ""));
  const [headers, ...rows] = lines;
  const headersArray = headers.split(separator).join(",");
  const rowsValues = rows
    .map((row) => {
      const currentRow = row.split(separator).map((value) => `'${value}'`);
      return `(${currentRow.join(",")}), \n`;
    })
    .join("");
  const sql = `INSERT into table(${headersArray}) values \n${rowsValues};`;
  return sql;
};
function App() {
  const [file, setFile] = React.useState<File | null>(null);
  const [sqlString, setSqlString] = React.useState("");
  const handleAddFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputFile = event.target.files?.[0];
    if (!inputFile) return;
    setFile(inputFile);
  };

  const handleGenerate = () => {
    const reader = new FileReader();
    reader.onload = (event) => {
      console.log(event);
      const csv = event.target?.result as string;
      setSqlString(getSqlString(csv));
    };
    reader.readAsText(file!);
  };
  return (
    <>
      <label htmlFor="file">Upload a CSV file:</label>
      <input type="file" onChange={handleAddFile} id="file" />
      <input type="button" value="Generate" onClick={handleGenerate} />
      <code>
        <pre>{sqlString}</pre>
      </code>
    </>
  );
}

export default App;

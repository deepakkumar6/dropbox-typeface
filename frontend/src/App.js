import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  // to push frontend changes
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const backendUrl = "http://localhost:5000"; //  "http://backend:5000";


  useEffect(() => {
    fetch(`${backendUrl}/files`)
      .then(res => res.json())
      .then(data => setFiles(data))
      .catch(err => console.error("Error fetching files:", err));
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await fetch(`${backendUrl}/upload`, {
        method: "POST",
        body: formData
      });
      alert("Uploaded successfully!");
      window.location.reload();
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  return (
    <div className="App">
      <h2>Dropbox</h2>

      <form onSubmit={handleUpload}>
        <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
        <button type="submit">Upload</button>
      </form>

      <h3>Uploaded Files</h3>
      <ul>
        {files.map((file) => (
          <li key={file.id}>
            {file.original_name}{" "}
            <a href={`${backendUrl}/download/${file.id}`} target="_blank" rel="noreferrer">
              <button>Download</button>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

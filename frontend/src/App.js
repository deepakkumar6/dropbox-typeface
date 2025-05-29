import React, { useState, useEffect } from "react";
import Button from "./components/button";
import "./App.css";

function App() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    // const mockData = [
    //   { id: 1, original_name: "Resume.pdf" },
    //   { id: 2, original_name: "Presentation.pptx" },
    //   { id: 3, original_name: "Design.png" },
    //   { id: 1, original_name: "Resume.pdf" },
    //   { id: 2, original_name: "Presentation.pptx" },
    //   { id: 3, original_name: "Design.png" },
    //   { id: 1, original_name: "Resume.pdf" },
    //   { id: 2, original_name: "Presentation.pptx" },
    //   { id: 3, original_name: "Design.png" },
    // ];
    // setFiles(mockData);

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

  const handleDownload = (fileId, fileName) => {
    const url = `${backendUrl}/download/${fileId}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="App">
      <h2>Dropbox</h2>

      <form onSubmit={handleUpload} className="upload-form">
        <div className="upload-instructions">
          <label className="custom-file-upload">
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
          Choose File
          </label>

          {selectedFile && (
            <div className="file-info">
              <span>{selectedFile.name}</span>
            </div>
          )}

        </div>
        

        <Button type="primary" onClick={handleUpload}>
          Upload
        </Button>
      </form>

      <h3>Uploaded Files</h3>
      <ul>
        {files.map((file) => (
          <li key={file.id}>
            {file.original_name}
            <Button
              type="secondary"
              onClick={() => handleDownload(file.original_name)}
            >
              Download
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

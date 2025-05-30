// File: src/components/FileList.jsx
import React, { useEffect, useState } from "react";
import Button from "./button";
import styles from "./file-list.module.css";

const previewableFormats = [".txt", ".json", ".jpg", ".jpeg", ".png"];

// const file = [
//         { id: 1, original_name: "Resume.pdf" },
//         { id: 2, original_name: "Presentation.pptx" },
//         { id: 3, original_name: "Design.png" },
//         { id: 1, original_name: "Resume.pdf" },
//         { id: 2, original_name: "Presentation.pptx" },
//         { id: 3, original_name: "Design.png" },
//         { id: 1, original_name: "Resume.pdf" },
//         { id: 2, original_name: "Presentation.pptx" },
//         { id: 3, original_name: "Design.png" },
//       ];

const FileList = ({ backendUrl, refreshList }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${backendUrl}/files`);
        if (!res.ok) throw new Error("Failed to fetch files");
        const data = await res.json();
        setFiles(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Unable to load files. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [backendUrl, refreshList]);

  const handleDownload = (fileId) => {
    const url = `${backendUrl}/download/${fileId}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleFileClick = (file) => {
    const ext = file.original_name.slice(file.original_name.lastIndexOf(".")).toLowerCase();

    if (!previewableFormats.includes(ext)) {
        alert("Preview not supported for this file type.");
        return;
    }
    window.open(`/files/${file.id}`, "_blank");
    };


  if (loading) return <div className={styles.fileListStatus}>Loading files...</div>;

  if (error)
    return <div className={styles.fileListStatusError}>{error}</div>;


  return (
    <ul className="file-list">
      {files.map((file) => (
        <li key={file.id} className="file-list-item" onClick={() => handleFileClick(file)}>
          <span className="file-name">{file.original_name}</span>
          <Button type="secondary" onClick={() => handleDownload(file.id)}>
            Download
          </Button>
        </li>
      ))}
    </ul>
  );
};

export default FileList;

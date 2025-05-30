// File: src/components/FileList.jsx
import React, { useEffect, useState } from "react";
import Button from "./button";
import styles from "./file-list.module.css";
import { useAppContext } from "../context/app-context";

const FileList = ({ refreshList }) => {
  const { backendUrl, supportedViewFormats } = useAppContext();
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

    if (!supportedViewFormats.includes(ext)) {
        alert("Preview not supported for this file type.");
        return;
    }
    window.open(`/files/${file.id}`, "_blank");
    };

  
  if (loading) return <div className={styles.fileListStatus}>Loading files...</div>;

  if (error)
    return <div className={styles.fileListStatusError}>{error}</div>;

  if (files.length === 0) {
    return <div className={styles.fileListEmptyStatus}>No files uploaded yet.</div>; 
  }


  return (
    <ul className="file-list">

      {/* <li className={styles["file-list-header"]}>
        <div className={styles["file-info"]}>
          <span className={styles["file-name"]}>File Name</span>
          <span className={styles["file-type"]}>Type</span>
          <span className={styles["file-date"]}>Uploaded Date</span>
          <span className={styles["file-time"]}>Uploaded Time</span>
        </div>
        <span><strong>Action</strong></span>
      </li> */}

      {files.map((file) => {
        const uploaded = new Date(file.uploaded_at);
        return (
          <li key={file.id} className={styles["file-list-item"]} onClick={() => handleFileClick(file)}>
            <div className={styles["file-info"]}>
              <span className={styles["file-name"]}>{file.original_name}</span>
              <span className={styles["file-type"]}>{file.type}</span>
              <span className={styles["file-date"]}>{uploaded.toLocaleDateString()}</span>
              <span className={styles["file-time"]}>{uploaded.toLocaleTimeString()}</span>
            </div>
            <Button type="secondary" onClick={(e) => {
              e.stopPropagation();
              handleDownload(file.id);
            }}>
              Download
            </Button>
          </li>
        );
      })}
    </ul>
  );
};

export default FileList;

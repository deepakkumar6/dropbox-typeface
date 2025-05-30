// components/UploadForm.jsx
import React, { useState } from "react";
import Button from "./button";
import "./uploadform.css";

const allowedFormats = [".txt",  ".pdf", ".docx", ".xlsx", ".png", ".jpg", ".jpeg", ".gif", ".pptx", ".zip", ".rar"];

const UploadForm = ({ backendUrl, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!allowedFormats.includes(ext)) {
      setError(`Unsupported file type: ${ext}`);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setError("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select a valid file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      setSelectedFile(null);
      setError("");
      onUploadSuccess();
    } catch (err) {
      console.error(err);
      setError("Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="upload-form">
      <label className="custom-file-upload">
        <input type="file" onChange={handleFileChange} />
        Choose File
      </label>

      {selectedFile && <div className="file-info">Selected file: {selectedFile.name}</div>}
      {error && <div className="error-message">{error}</div>}

      <Button type="primary" disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </Button>
    </form>
  );
};

export default UploadForm;

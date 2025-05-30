// components/UploadForm.jsx
import React, { useState } from "react";
import Button from "./button";
import "./uploadform.css";
import { useAppContext } from "../context/app-context";
import { useBanner } from "../context/banner-context";

const UploadForm = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const { backendUrl, supportedUploadFormats } = useAppContext();
  const { showBanner } = useBanner();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!supportedUploadFormats.includes(ext)) {
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

      if (!res.ok) {
        throw new Error("Upload failed");
        showBanner("Upload failed. Please try again.", "error");
      }

      setSelectedFile(null);
      setError("");
      onUploadSuccess();
      showBanner("File uploaded successfully!", "success");
    } catch (err) {
      console.error(err);
      setError("Upload failed. Try again.");
      showBanner("Upload failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="upload-form">
      <div className="upload-header">
        <label className="custom-file-upload">
          <input type="file" onChange={handleFileChange} />
          Choose File
        </label>
        {selectedFile && <div className="file-info">Selected file: {selectedFile.name}</div>}

      </div>

      <Button type="primary" disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </Button>
    </form>
  );
};

export default UploadForm;

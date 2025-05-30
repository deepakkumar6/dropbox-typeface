import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const FilePreview = () => {
  const { id } = useParams();
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
  const [content, setContent] = useState(null);
  const [type, setType] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${backendUrl}/files/${id}`)
      .then(res => {
        const contentType = res.headers.get("Content-Type") || "";
        setType(contentType);
        if (contentType.includes("text") || contentType.includes("json")) {
          return res.text().then(text => ({ content: text, type: contentType }));
        } else if (contentType.includes("image")) {
          return res.blob().then(blob => ({ content: URL.createObjectURL(blob), type: contentType }));
        } else {
          throw new Error("Unsupported preview format");
        }
      })
      .then(({ content }) => {
        setContent(content);
      })
      .catch(err => setError("Failed to load preview: " + err.message));
  }, [id]);

  if (error) return <div>{error}</div>;
  if (!content) return <div>Loading...</div>;

  if (type.includes("image")) {
    return <img src={content} alt="preview" style={{ maxWidth: "100%" }} />;
  }

  return <pre>{content}</pre>;
};

export default FilePreview;

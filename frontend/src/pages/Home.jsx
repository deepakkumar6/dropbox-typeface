import React, { useState, useEffect } from "react";
import "../App.css";
import FileList from "../components/file-list";
import UploadForm from "../components/uploadform";


function Home() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [refreshList, setRefreshList] = useState(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  return (
    <div className="App">
      <h2>Dropbox</h2>

      <UploadForm
        backendUrl={backendUrl}
        onUploadSuccess={() => setRefreshList((prev) => !prev)}
      />

      <h3>Uploaded Files</h3>
      <FileList backendUrl={backendUrl} refreshList={refreshList} />
    </div>
  );
}

export default Home;

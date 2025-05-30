import React, { useState, useEffect } from "react";
import "../App.css";
import FileList from "../components/file-list";
import UploadForm from "../components/uploadform";
import Banner from "../components/banner";
import { useBanner } from "../context/banner-context";


function Home() {
  const [refreshList, setRefreshList] = useState(false);
  const { banner } = useBanner();

  return (
    <div className="App">
      <div className="content">
        <h2>FileNest</h2>
        <Banner text={banner.text} type={banner.type} onClose={() => {}} />
        <UploadForm
          onUploadSuccess={() => setRefreshList((prev) => !prev)}
        />
        
        <h3>Uploaded Files</h3>
        <FileList refreshList={refreshList} />

      </div>
      
    </div>
  );
}

export default Home;

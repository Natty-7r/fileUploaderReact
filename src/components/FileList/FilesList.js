import axios from "axios";
import { useEffect, useState } from "react";
import "./FilesList.css";
import FileListRow from "./FileListRow";
const baseUrl = "http://localhost:8080";
export default ({ active, fileListChanged, setListChange }) => {
  const [files, setFiles] = useState([]);
  useEffect(() => {
    axios
      .get(`${baseUrl}/file`)
      .then((response) => {
        console.log(response);
        if (response.data.status == "success") {
          setFiles(response.data.files);
        }
        if (response.data.status == "fail") {
        }
      })
      .catch((error) => {});
  }, [fileListChanged]);
  return (
    <div
      className={`filesList ${
        active == 2 ? "filesList-hidden" : "filesList-visible"
      }`}>
      <div className="filesList_header">
        {" "}
        <div className="list_row">
          <div className="listColumn">filename</div>
          <div className="listColumn">file size </div>
          <div className="listColumn"> upload date </div>
          <div className="listColumn"> delete </div>
        </div>
      </div>
      <div className="filesList_main">
        {files.length == 0 ? (
          <h1 className="nofile_header">file list is empty !</h1>
        ) : (
          files.map((file, index) => (
            <FileListRow
              setListChange={setListChange}
              fileListChanged={fileListChanged}
              file={file}
              key={index}
            />
          ))
        )}
      </div>
    </div>
  );
};

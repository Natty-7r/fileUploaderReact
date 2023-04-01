import { useEffect, useState } from "react";
import FilesList from "./components/FileList/FilesList";
import FileUploader from "./components/Uploader/FileUploader";
import "./App.css";
function App(props) {
  const [active, setActive] = useState(1);
  const [fileListChanged, setListChange] = useState(0);
  return (
    <div className="app">
      <h2 className="menu">
        <button
          className={`menu_btn ${active == 1 ? "active" : ""} `}
          onClick={(e) => {
            setActive(1);
          }}>
          list
        </button>
        <button
          className={`menu_btn ${active == 2 ? "active" : ""} `}
          onClick={(e) => {
            setActive(2);
          }}>
          upload
        </button>
      </h2>
      <div className="app_main">
        <FilesList
          active={active}
          setListChange={setListChange}
          fileListChanged={fileListChanged}
        />
        <FileUploader
          active={active}
          setActive={setActive}
          fileListChanged={fileListChanged}
          setListChange={setListChange}
        />
      </div>
    </div>
  );
}
export default App;

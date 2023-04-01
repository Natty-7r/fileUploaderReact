import axios from "axios";
const baseUrl = "http://localhost:8080";
const formatSize = (size) => {
  let sizeString = "";
  if (size < 1024) sizeString = `${size} bytes`;
  if (size < 1024 * 1024) sizeString = `${Math.round(size / 1024)} kbs`;
  else sizeString = `${Math.round((size / 1024) * 1024)} mbs`;
  return sizeString;
};
export default ({ file, fileListChanged, setListChange }) => {
  const handleRemoveFile = () => {
    axios
      .delete(`${baseUrl}/file/${file.fileId}`)
      .then((response) => {
        console.log(response);
        if (response.data.status == "success") {
          setListChange(fileListChanged + 1);
        }
        if (response.data.status == "fail") {
        }
      })
      .catch((error) => {});
  };
  return (
    <div className="list_row">
      <div className="listColumn">{file.fileName}</div>
      <div className="listColumn">{formatSize(file.fileSize)} </div>
      <div className="listColumn">
        {" "}
        {new Date(file.uploadDate).toLocaleDateString()}{" "}
      </div>
      <div className="listColumn">
        {" "}
        <button
          className="btn_delete"
          onClick={handleRemoveFile}>
          remove{" "}
        </button>{" "}
      </div>
    </div>
  );
};

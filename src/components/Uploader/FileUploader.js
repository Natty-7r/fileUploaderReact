import axios from "axios";
import { useState } from "react";
import "./FileUploader.css";
const baseUrl = "http://localhost:8080";
export default ({ active, setActive, fileListChanged, setListChange }) => {
  const [fileSet, setFileSet] = useState(false);
  const [formError, setFormError] = useState(false);
  const [errorMsg, setErrorMsg] = useState(" file size cannot exceed 10MB");
  const [data, setData] = useState({});
  const formData = new FormData();
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  const handleUploadFile = (e) => {
    e.preventDefault();
    axios
      .post(`${baseUrl}/file`, data, config)
      .then((response) => {
        if (response.data.status == "success") {
          setListChange(fileListChanged + 1);
          setActive(1);
        }
        if (response.data.status == "fail") {
          setErrorMsg("unable to upload file !");
          setFormError(true);
          setTimeout(() => {
            setFormError(false);
          }, 3000);
        }
      })
      .catch((error) => {
        setErrorMsg("unable to upload file !");
        setFormError(true);
        setTimeout(() => {
          setFormError(false);
        }, 3000);
      });
  };

  return (
    <form
      className={`uploader_form ${
        active == 2 ? "uploader_form-visible" : "uploader_form-hidden"
      }`}>
      <div className="form_error">{formError ? errorMsg : ""}</div>
      <input
        type="file"
        className="add"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file.size > 10 * 1000 * 1000) {
            setErrorMsg(" file size cannot exceed 10MB");
            setFormError(true);
          } else {
            formData.append("file", file);
            setData(formData);
            setFormError(false);
          }
          setFileSet(true);
        }}
      />
      <button
        onClick={handleUploadFile}
        className="btn"
        disabled={!fileSet || formError}>
        upload
      </button>
    </form>
  );
};

import React from "react";
import "./ImageItem.css";
import { IoMdClose } from "react-icons/io";

function ImageItem({ file, handleRemoveImage }) {
  return (
    <div className="image-container">
      <div className="image-overlay">
        <IoMdClose
          onClick={() => handleRemoveImage(file)}
          size="30"
          color="#FFFFFF"
        />
      </div>
      <img
        className="image-css w-75"
        src={URL.createObjectURL(file)}
        alt="..."
      />
    </div>
  );
}

export default ImageItem;

import React from 'react';
import "./ImagesList.css";
import ImageItem from "./ImageItem/ImageItem";

function AvatarList({ files, setFiles }) {
  const handleRemoveImage = (file) => {
    setFiles(files.filter((item) => item.name !== file.name));
  };
  return (
    <div className="images-list-container">
      {(file, index) => (
        <ImageItem
          key={`${file.name}${index}`}
          file={file}
          handleRemoveImage={handleRemoveImage}
        />
      )}
    </div>
  );
}

export default AvatarList;
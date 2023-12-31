import "./upload-image.css";
import ImagesList from "./images-list/ImagesList";
import { MDBCardImage } from "mdb-react-ui-kit";

function UploadImages({ files, setFiles }) {
  function handleChange(event) {
    const fileList = event.target.files;

    setFiles([...fileList]);
  }

  return (
    <div>
        <label className="label">
          <p className="text-muted mt-2 me-3">Upload img</p>
          <input
            multiple="multiple"
            type="file"
            onChange={handleChange}
            accept="/image/*"
          />
          <figure className="personal-figure">
            <figcaption className="personal-figcaption">
              <MDBCardImage src="https://raw.githubusercontent.com/ThiagoLuizNunes/angular-boilerplate/master/src/assets/imgs/camera-white.png" />
            </figcaption>
          </figure>
        </label>

      {files && <ImagesList files={files} setFiles={setFiles} />}
    </div>
  );
}

export default UploadImages;

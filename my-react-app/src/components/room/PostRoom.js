import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardBody,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBBtn,
  MDBInput,
} from "mdb-react-ui-kit";
import AppHeader from "../header/AppHeader";
import AppFooter from "../footer/Footer";
import {
  apiGetProvinces,
  apiGetDistrictsOfProvinces,
  apiGetWardsOfDistrict,
  createRoomService,
} from "../../services/room/room.service";
import { useNavigate } from "react-router-dom";
import { errorHandleUtil } from "../../services/error-handle/error-handle.util";
import UploadImages from "../common/upload-images/UploadImages";
import { handleUploadFile } from "../common/upload-images/upload-image.util";

function PostRoom(props) {
  const refreshPage = () => {
    window.location.reload(false);
  };
  const [files, setFiles] = useState(null); 
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [ward, setWard] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  const [numberHome, setNumberHome] = useState("");

  const handleNumberHome = (e) => {
    setNumberHome(e.target.value);
  };
  const handleProvinces = async (e) => {
    const index = e.target.value;
    const currentProvince = provinces[index];
    setSelectedProvince(currentProvince);

    // tim huyen theo tinh
    try {
      const districtRes = await apiGetDistrictsOfProvinces(
        currentProvince.province_id
      );
      setDistricts(districtRes.data.results);
    } catch (error) {}
  };

  const handleDistricts = async (e) => {
    const index = e.target.value;
    const currentDistrict = districts[index];
    setSelectedDistrict(currentDistrict);

    // tim xa theo huyen
    try {
      const wardsRes = await apiGetWardsOfDistrict(currentDistrict.district_id);
      setWard(wardsRes.data.results);
    } catch (error) {}
  };

  const handleWards = async (e) => {
    const index = e.target.value;
    const currentWard = ward[index];
    setSelectedWard(currentWard);
  };
  const [createPayload, setCreatePayload] = useState({
    address: "",
    price: "",
    acreage: "",
    description: "",
    roomImages: "",
  });
  const { address, price, acreage, description, roomImages } = createPayload;
  const mergeData = `${numberHome} - ${selectedWard?.ward_name || ""} - ${
    selectedDistrict?.district_name || ""
  } - ${selectedProvince?.province_name || ""}`;

  const handleChangeCreatePayload = (event) => {
    setCreatePayload({
      ...createPayload,
      [event.target.name]: event.target.value,
    });
  };
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await apiGetProvinces();
        setProvinces(response.data.results); // get City
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    fetchAddress();
  }, []);

  const handleCreate = async (e) => {
    try {
      setIsLoading(true);
      e.preventDefault();

      const roomImages = files
        ? await Promise.all(
            files.map(async (file) => {
              return await handleUploadFile(file);
            })
          )
        : null;

      const response = await createRoomService({
        ...createPayload,
        address: mergeData,
        roomImages,
      });
      const message = response.data.message;
      toast.success(message);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      const message = error.response.data.message;
      errorHandleUtil(message, toast);
      setIsLoading(false);
    }
  };

  return (
    <>
      <header id="header">
        <AppHeader />
      </header>

      <section style={{ backgroundColor: "#eee" }}>
        <MDBContainer className="py-5 mt-3">
          <MDBRow>
            <MDBCol>
              <MDBBreadcrumb className="bg-light rounded-3 p-3 mb-4">
                <MDBBreadcrumbItem>
                  <a
                    style={{
                      color: "red",
                    }}
                    href="/"
                  >
                    Home
                  </a>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem active>Upload Room</MDBBreadcrumbItem>
              </MDBBreadcrumb>
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol lg="4">
              <MDBCard className="mb-4">
                <MDBCardBody className="text-center">
                  <UploadImages files={files} setFiles={setFiles} />
                </MDBCardBody>
              </MDBCard>
            </MDBCol>

            <MDBCol lg="8">
              <MDBCard className="mb-4">
                <h5 className="fw-bold mt-2 text-center">
                  Upload Infomation Room
                </h5>
                <p className="text-muted ms-2 fw-bold">Address</p>
                <MDBRow
                  tag="form"
                  className="row-cols-lg-auto g-3 align-items-center"
                >
                  <MDBCol className="ms-5 me-4" lg="5" size="12">
                    <div className="form-floating">
                      <select
                        className="form-select"
                        id="floatingSelect"
                        aria-label="Floating label select example"
                        onChange={handleProvinces}
                      >
                        <option>-- Select city --</option>
                        {provinces.map((pro, index) => (
                          <option value={index} key={pro.province_id}>
                            {pro.province_name}
                          </option>
                        ))}
                      </select>
                      <label for="floatingSelect">City</label>
                    </div>
                  </MDBCol>
                  <MDBCol lg="5" size="12">
                    <div className="form-floating">
                      <select
                        className="form-select"
                        id="floatingSelect"
                        aria-label="Floating label select example"
                        onChange={handleDistricts}
                      >
                        {districts.map((district, index) => (
                          <option value={index} key={district.district_id}>
                            {district.district_name}
                          </option>
                        ))}
                      </select>
                      <label for="floatingSelect">District</label>
                    </div>
                  </MDBCol>
                  <MDBCol className="ms-5 me-4" lg="5" size="12">
                    <div className="form-floating">
                      <select
                        className="form-select"
                        id="floatingSelect"
                        aria-label="Floating label select example"
                        onChange={handleWards}
                        // value={ward}
                        // setValue={setWard}
                      >
                        {ward.map((ward, index) => (
                          <option key={ward.ward_id} value={index}>
                            {ward.ward_name}
                          </option>
                        ))}
                      </select>
                      <label for="floatingSelect">Ward</label>
                    </div>
                  </MDBCol>
                  <MDBCol lg="5" size="12">
                    <div className="form-floating">
                      <MDBInput
                        label="Input home number"
                        id="formControlLg"
                        type="text"
                        size="lg"
                        style={{
                          height: "58px",
                        }}
                        value={numberHome}
                        onChange={handleNumberHome}
                      />
                    </div>
                  </MDBCol>
                </MDBRow>
                <MDBCol className="ms-5 me-4"></MDBCol>

                <p className="text-muted mt-2 ms-2 fw-bold">Your Addess</p>

                <MDBCol className="ms-5 me-4">
                  <form className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="floatingInputValue"
                      disabled
                      value={mergeData}
                    />
                  </form>
                </MDBCol>

                <p className="text-muted mt-2 ms-2 fw-bold">Desciption</p>
                <MDBCol className="ms-5 me-4 mb-3">
                  <div
                    className="form-outline"
                    style={{
                      borderStyle: "solid",
                      borderWidth: "1px",
                    }}
                  >
                    <textarea
                      className="form-control pt-5"
                      id="textAreaExample3"
                      rows="2"
                      onChange={handleChangeCreatePayload}
                      value={description}
                      name="description"
                    ></textarea>
                    <label className="form-label mt-2" for="textAreaExample3">
                      Message
                    </label>
                  </div>
                </MDBCol>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                >
                  <p className="text-muted mt-2  ms-2 flex-grow-1 fw-bold">
                    Price
                  </p>
                  <p className="text-muted mt-2 ms-5 flex-grow-1 fw-bold">
                    Acreage
                  </p>
                </div>
                <MDBRow
                  tag="form"
                  className="row-cols-lg-auto g-3 align-items-center"
                >
                  <MDBCol className="ms-5 me-1  " lg="3" size="12">
                    <div className="form-floating">
                      <input
                        type="number"
                        className="form-control"
                        id="floatingInputValue"
                        onChange={handleChangeCreatePayload}
                        value={price}
                        name="price"
                      />
                      <label className="form-label" for="textAreaExample3">
                        Enter Price
                      </label>
                    </div>
                  </MDBCol>
                  <MDBCol lg="3" size="12">
                    <div className="form-outline">
                      <span className="form-control">VNĐ/Month</span>
                    </div>
                  </MDBCol>
                  <MDBCol className="" lg="3">
                    <div className="form-floating">
                      <input
                        type="number"
                        className="form-control"
                        id="floatingInputValue"
                        onChange={handleChangeCreatePayload}
                        value={acreage}
                        name="acreage"
                      />
                      <label className="form-label" for="textAreaExample3">
                        Enter Acreage
                      </label>
                    </div>
                  </MDBCol>
                  <MDBCol lg="2">
                    <div className="form-outline">
                      <span className="form-control">
                        m<sup>2</sup>
                      </span>
                    </div>
                  </MDBCol>
                </MDBRow>

                <MDBRow>
                  <MDBRow
                    tag="form"
                    className="row-cols-lg-auto "
                    style={{
                      marginBottom: "20px",
                      marginLeft: "185px",
                      marginTop: "20px",
                    }}
                  >
                    <MDBCol lg="4" size="12">
                      <MDBBtn
                        className="me-1"
                        color="secondary"
                        onClick={refreshPage}
                      >
                        Clear
                      </MDBBtn>
                    </MDBCol>
                    <MDBCol lg="4" size="12">
                      <MDBBtn onClick={handleCreate} className="me-1">
                        {isLoading ? "Loading…" : "Upload"}
                      </MDBBtn>
                    </MDBCol>
                  </MDBRow>
                </MDBRow>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      <footer id="footer">
        <AppFooter />
      </footer>
      <ToastContainer />
    </>
  );
}

export default PostRoom;

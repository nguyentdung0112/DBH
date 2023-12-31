import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { forgotPassword, signIn } from "../services/auth/auth.service";
import "react-toastify/dist/ReactToastify.css";
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBCard,
  MDBCardImage,
  MDBCardBody,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from "mdb-react-ui-kit";
import { errorHandleUtil } from "../services/error-handle/error-handle.util";
import ForgotPasswordPage from "../components/user/ForgotPasswordPage";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleChangeEmailValue = (e) => {
    setEmail(e.target.value);
  };

  const handleChangePasswordValue = (e) => {
    setPassword(e.target.value);
  };

  const [basicModal, setBasicModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [isOpenVerifyOtpModal, setIsOpenVerifyOtpModal] = useState(false);
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const toggleOpen = () => {
    setBasicModal(!basicModal);
    setEmail("");
  };
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const response = await signIn(email, password);

      const message = response.data.message;

      const accessToken = response.data.accessToken;
      const avatar = response.data.avatar;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("avatar", avatar);

      toast.success(message);

      navigate("/");
    } catch (error) {
      const message = error.response.data.message;
      errorHandleUtil(message, toast);
    }
  };

  const handleSubmitEmail = async () => {
    try {
      setIsLoading(true);
      const response = await forgotPassword(email);

      const message = response.data.message;
      const EMAIL_URL = response.data.EMAIL_URL;

      toast.success(message);
      setTimeout(() => {
        setIsLoading(false);
  
        setTimeout(() => {

          window.open(EMAIL_URL, "_blank", "noreferrer");
          setIsOpenVerifyOtpModal(true);
        }, [500]);
      }, [500]);
    } catch (error) {
      const message = error.response.data.message;
      toast.error(message);
  
    }
  };

  return (
    <div className="App">
      <MDBContainer className="my-5">
        <MDBCard>
          <MDBRow className="g-0">
            <MDBCol md="6">
              <MDBCardImage
                src="https://img.freepik.com/free-photo/blue-house-with-blue-roof-sky-background_1340-25953.jpg"
                alt="login form"
                className="rounded-start w-100 h-100"
              />
            </MDBCol>

            <MDBCol md="6">
              <MDBCardBody className="d-flex flex-column">
                <div className="d-flex flex-row mt-2">
                  <MDBIcon
                    fas
                    icon="cubes fa-3x me-3"
                    style={{ color: "#ff6219" }}
                  />
                  <span className="h1 fw-bold mb-0">DBH</span>
                </div>

                <h5
                  className="fw-normal my-4 pb-3"
                  style={{ letterSpacing: "1px" }}
                >
                  Sign into your account
                </h5>

                <MDBInput
                  wrapperClass="mb-4"
                  label="Email address"
                  type="email"
                  size="lg"
                  name="email"
                  value={email}
                  onChange={handleChangeEmailValue}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    size="lg"
                    name="password"
                    value={password}
                    onChange={handleChangePasswordValue}
                  />

                  <MDBBtn
                    size="lg"
                    className="h-25  pt-2"
                    outline
                    color="info"
                    onClick={handleShowPassword}
                  >
                    {showPassword ? (
                      <MDBIcon far icon="eye-slash" />
                    ) : (
                      <MDBIcon far icon="eye" />
                    )}
                  </MDBBtn>
                </div>
                <MDBBtn
                  onClick={handleLogin}
                  className="mb-4 px-5"
                  color="dark"
                  size="lg"
                >
                  Login
                </MDBBtn>
                <a
                  className="small text-muted mt-3 mb-3"
                  href="#!"
                  onClick={toggleOpen}
                >
                  Forgot password?
                </a>

                <p className=" mt-3 pb-lg-2" style={{ color: "#393f81" }}>
                  Don't have an account?{" "}
                  <a href="/sign-up" style={{ color: "#393f81" }}>
                    Register here
                  </a>
                </p>
              </MDBCardBody>
            </MDBCol>
          </MDBRow>
        </MDBCard>
      </MDBContainer>
      {/* modal input email */}
      <MDBModal open={basicModal} setopen={setBasicModal} tabIndex="-1">
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Forgot Password</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleOpen}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <MDBInput
                wrapperClass="mb-4"
                label="Email address"
                id="formControlLg"
                type="email"
                size="lg"
                name="emailCheck"
                value={email}
                onChange={handleChangeEmailValue}
              />
            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={toggleOpen}>
                Close
              </MDBBtn>
              <MDBBtn onClick={handleSubmitEmail}>
                {isLoading ? "Loading…" : "Send"}
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>

      <ForgotPasswordPage
        email={email}
        isOpenVerifyOtpModal={isOpenVerifyOtpModal}
        setIsOpenVerifyOtpModal={setIsOpenVerifyOtpModal}
        closeForgotPasswordModal={toggleOpen}
      />
      <ToastContainer />
    </div>
  );
}
export default SignInPage;

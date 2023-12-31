import { signUp } from "../services/auth/auth.service";
import { ToastContainer, toast } from "react-toastify";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBInput,
  MDBCard,
  MDBCardImage,
  MDBCardBody,
  MDBCheckbox,
  MDBIcon,
} from "mdb-react-ui-kit";
import { errorHandleUtil } from "../services/error-handle/error-handle.util";

function SignUpPage(props) {
  const navigate = useNavigate();

  const [isCheckedRole, setIsCheckedRole] = useState(false);

  const [signUpPayload, setSignUpPayload] = useState({
    userName: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const handleChangeSignUpPayload = (event) => {
    setSignUpPayload({
      ...signUpPayload,
      [event.target.name]: event.target.value,
    });
  };

  const handleRoleChange = () => {
    setIsCheckedRole(!isCheckedRole);
  };
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUp = async () => {
    try {
      setIsLoading(true);
      if (confirmPassword !== password) {
        toast.error("Password not match");
        return;
      }
      const response = await signUp({
        ...signUpPayload,
        isOwner: isCheckedRole,
      });

      const message = response.data.message;
      toast.success(message);

      setTimeout(() => {
        setIsLoading(false);

        setTimeout(() => {
          navigate("/sign-in");
        }, [500]);
      }, [500]);
    } catch (error) {
      const message = error.response.data.message;
      // toast.error(message);
      errorHandleUtil(message, toast);
      setIsLoading(false);
    }
  };

  const { userName, fullName, email, password, confirmPassword } =
    signUpPayload;

  return (
    <div className="App">
      <MDBContainer fluid className="my-5">
        <MDBRow className="g-0 align-items-center">
          <MDBCol col="6">
            <MDBCard
              className="my-5 cascading-right"
              style={{
                background: "hsla(0, 0%, 100%, 0.55)",
                backdropFilter: "blur(30px)",
              }}
            >
              <MDBCardBody className="p-5 shadow-5 text-center">
                <h2 className="fw-bold mb-5">Sign up now</h2>

                <MDBRow>
                  <MDBCol col="6">
                    <MDBInput
                      wrapperClass="mb-4"
                      label="User name"
                      id="form1"
                      type="text"
                      name="userName"
                      value={userName}
                      onChange={handleChangeSignUpPayload}
                    />
                  </MDBCol>

                  <MDBCol col="6">
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Full name"
                      id="form2"
                      type="text"
                      name="fullName"
                      value={fullName}
                      onChange={handleChangeSignUpPayload}
                    />
                  </MDBCol>
                </MDBRow>

                <MDBInput
                  wrapperClass="mb-4"
                  label="Email"
                  id="form3"
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChangeSignUpPayload}
                />
                <div
                  style={{
                    display: "flex",
                    gap: 5,
                  }}
                >
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Password"
                    id="form4"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={handleChangeSignUpPayload}
                  />

                  <MDBInput
                    wrapperClass="mb-4"
                    label="Confirm Password"
                    id="form5"
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleChangeSignUpPayload}
                  />
                  <MDBBtn
                    size="sm"
                    className="h-25 pt-2"
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
                <div className="d-flex justify-content-center mb-4">
                  <MDBCheckbox
                    name="flexCheck"
                    id="flexCheckDefault"
                    label="Have role Owner-house"
                    checked={isCheckedRole}
                    onChange={handleRoleChange}
                  />
                </div>

                <MDBBtn onClick={handleSignUp} size="md">
                  {isLoading ? "Loading…" : "Sign up"}
                </MDBBtn>

                <div className="text-center">
                  Do you have an account?{" "}
                  <a href="/sign-in" className="text-primary fw-bold">
                    Login here
                  </a>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>

          <MDBCol col="6">
            <MDBCardImage
              src="https://media.istockphoto.com/id/1255835530/photo/modern-custom-suburban-home-exterior.jpg?s=612x612&w=0&k=20&c=0Dqjm3NunXjZtWVpsUvNKg2A4rK2gMvJ-827nb4AMU4="
              className="rounded-start w-100 h-100"
              alt="sign up form"
              fluid
            />
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <ToastContainer />
    </div>
  );
}

export default SignUpPage;

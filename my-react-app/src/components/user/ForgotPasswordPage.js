import React, { useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBValidation,
  MDBValidationItem,
  MDBInput,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";
import { ToastContainer, toast } from "react-toastify";

import { resetPassword } from "../../services/auth/auth.service";
function ForgotPasswordPage({
  isOpenVerifyOtpModal,
  setIsOpenVerifyOtpModal,
  email,
  closeForgotPasswordModal,
}) {
  // const [basicModal, setBasicModal] = useState(true);
  const toggleOpen = () => {
    setIsOpenVerifyOtpModal(!isOpenVerifyOtpModal);

    setOtp(new Array(4).fill(""));
    setUpdatePassword(null);
    closeForgotPasswordModal();
  };

  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [updatePassword, setUpdatePassword] = useState(null);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    //Focus next input
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };
  const [isLoading, setIsLoading] = useState(false);

  const verifyOtp = async () => {
    try {
      if (!updatePassword) {
        toast.error("please input your update password");
      }
      setIsLoading(true);

      const response = await resetPassword({
        otp: otp.toString().replaceAll(",", ""),
        email,
        updatePassword,
      });

      const message = response.data.message;
      toast.success(message);
      toggleOpen();

      setTimeout(() => {
        setIsLoading(false);
      }, [500]);
      setOtp(new Array(4).fill(""));
      setUpdatePassword(null);
    } catch (error) {
      const message = error.response.data.message;
      toast.error(message);
      setIsLoading(false);
    }
  };
  return (
    <>
      <MDBModal
        open={isOpenVerifyOtpModal}
        setopen={toggleOpen}
        tabIndex="-1"
      >
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>OTP Checked</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleOpen}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <div className="row">
                <div className="col text-center">
                  <p>
                    We have sent the otp code to your email. Please check your
                    mailbox
                  </p>

                  {otp.map((data, index) => {
                    return (
                      <input
                        className="otp-field"
                        type="number"
                        name="otp"
                        maxLength="1"
                        key={index}
                        value={data}
                        onChange={(e) => handleChange(e.target, index)}
                        onFocus={(e) => e.target.select()}
                      />
                    );
                  })}

                  <p
                    style={{
                      marginTop: "10px",
                    }}
                  >
                    OTP Entered - {otp.join("")}
                  </p>
                </div>
              </div>

              <MDBRow>
                <MDBValidation isValidated>
                  <MDBValidationItem col="6">
                    <MDBCol>
                      <MDBInput
                        style={{
                          marginBottom: "20px",
                        }}
                        wrapperClass="mb-5"
                        name="newPassword"
                        id="validationCustom01"
                        required
                        label="New Password"
                        labelClass="text-black"
                        type="password"
                        size="lg"
                        className="form-control"
                        value={updatePassword}
                        onInput={(e) => setUpdatePassword(e.target.value)}
                      />
                    </MDBCol>
                  </MDBValidationItem>
                </MDBValidation>
              </MDBRow>
            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn
                color="secondary"
                onClick={(e) => setOtp([...otp.map((v) => "")])}
              >
                Clear
              </MDBBtn>
              <MDBBtn onClick={verifyOtp}>
                {isLoading ? "Loading…" : "Send"}
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>

      <ToastContainer />
    </>
  );
}

export default ForgotPasswordPage;

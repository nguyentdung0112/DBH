import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import "./PaymentSuccess.css";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "react-bootstrap/Spinner";
import moment from "moment";
import { getPaymentDetailService } from "../../services/payment/Payment.auth";
import { convertNumberToVNDPayment } from "../../urils/convert-number-to-VND";
import { createBookingService } from "../../services/booking/booking.service";

function PaymentSuccess({ roomId }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries([...searchParams]);
  const { vnp_Amount } = params;
  const [paymentInfo, setPaymentInfo] = useState(null);

  const [loading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkStatusPayment = async () => {
      try {
        setIsLoading(true);

        const res = await getPaymentDetailService(params);

        const { RspCode, message, data } = res.data;

        if (RspCode === "00" && message === "success") {
          setPaymentInfo(res.data.data);
          setIsLoading(false);
          const createBookingPayload = JSON.parse(
            localStorage.getItem("createBookingPayload")
          );
          if (createBookingPayload) {
            const createBooking = await createBookingService(
              createBookingPayload
            );
            toast.success("Payment successfully");
            toast.success(createBooking.data.message);
          }

          setTimeout(() => {
            window.close();
          }, 5000);
        }
      } catch (error) {
        setIsLoading(false);
      }
    };

    checkStatusPayment();
  }, []);

  return (
    <div className="mainContainer">
      {loading && (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )}
      {paymentInfo && (
        <div className="innerContainer">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              margin: 20,
            }}
          >
            <div
              style={{
                backgroundColor: "#E4F3ED",
                padding: 20,
                borderRadius: "50%",
              }}
            >
              <FaCheckCircle color="#23A26D" size="50" />
            </div>

            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontFamily: "Poppins",
                  fontSize: 27,
                  fontWeight: 400,
                }}
              >
                Payment Success
              </p>

              <p
                style={{
                  fontFamily: "Poppins",
                  fontSize: 40,
                  fontStyle: "normal",
                  fontWeight: 600,
                }}
              >
                {convertNumberToVNDPayment(vnp_Amount)}
              </p>
            </div>
          </div>

          <div style={{ padding: 20 }}>
            <div className="payment-content-row">
              <p className="payment-content-label">Ref Number</p>
              <p className="payment-content-info">{paymentInfo.bankTranNo}</p>
            </div>

            <div className="payment-content-row">
              <p className="payment-content-label">Payment Time</p>
              <p className="payment-content-info">
                {moment(paymentInfo.payDate).format("MMMM Do YYYY, h:mm:ss a")}
              </p>
            </div>

            <div className="payment-content-row">
              <p className="payment-content-label">Payment method</p>
              <p className="payment-content-info">{paymentInfo.bankCode}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentSuccess;

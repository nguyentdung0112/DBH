const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const {
  loggerErrorMiddleware,
  errorResponseMiddleware,
} = require("./middlewares/handle-error.middleware");

const { userRouter } = require("./routes/user.route");
const { roomRouter } = require("./routes/room.route");
const { commentRouter } = require("./routes/comment.route");
const { paymentRouter } = require("./routes/payment.route");
const { bookingRouter } = require("./routes/booking.route");

const app = express();
const port = 3000;

const corOptions = {
  origin: "http://localhost:4000",
};
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors(corOptions));



app.use(userRouter);
app.use(roomRouter);
app.use(commentRouter)
app.use(paymentRouter)
app.use(bookingRouter);

app.use(loggerErrorMiddleware);
app.use(errorResponseMiddleware);
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

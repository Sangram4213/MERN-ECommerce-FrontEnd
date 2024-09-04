import { load } from "@cashfreepayments/cashfree-js";
import axios from "axios";
import { MouseEvent, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useNewOrderMutation } from "../redux/api/orderAPI";
import { resetCart } from "../redux/reducer/cartReducer";
import { RootState } from "../redux/store";
import { NewOrderRequest } from "../types/api-types";
import { responseToast } from "../utils/features";

const Pay = () => {
  //   const [orderId, setOrderId] = useState<any>();

  const [newOrder] = useNewOrderMutation();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { user } = useSelector((state: RootState) => state.userReducer);

  const {
    shippingInfo,
    cartItems,
    subtotal,
    tax,
    discount,
    shippingCharges,
    total,
  } = useSelector((state: RootState) => state.cartReducer);

  useEffect(() => {
    if (cartItems.length === 0) return navigate("/cart");
  }, [cartItems]);

  const orderData: NewOrderRequest = {
    shippingInfo,
    orderItems: cartItems,
    subtotal,
    tax,
    discount,
    shippingCharges,
    total,
    user: user?._id!,
  };

  let cashfree: any;

  const initializeSDK = async function () {
    cashfree = await load({
      mode: "sandbox",
    });
  };

  initializeSDK();

  const paymentRequestBody = {
    name: user?.name!,
    id: user?._id!,
    email: user?.email!,
    amount: total!,
  };

  const getSessionId = async () => {
    try {
      let res = await axios.get(
        `${import.meta.env.VITE_SERVER}/api/v1/payment/create/${
          paymentRequestBody.name
        }/${paymentRequestBody.id}/${paymentRequestBody.amount}/${
          paymentRequestBody.email
        }`
      );
      if (res && res?.data?.response) {
        // setOrderId(res?.data?.response?.orderId);
        return res?.data?.response?.paymentSessionId;
      }
    } catch (error) {
      console.log(error);
    }
  };

  //   const verifyPayment = async (orderId: any) => {
  //     try {
  //       let res = await axios.post(
  //         `${import.meta.env.VITE_SERVER}/api/v1/payment/verify`,
  //         {
  //           orderId: orderId,
  //         }
  //       );
  //       if (res && res.data == 200) {
  //         toast.success("Payment Verified");
  //       }
  //     } catch (error: any) {
  //       console.log("Error executing POST request:");
  //     }
  //   };

  const handleClick = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    try {
      let sessionId = await getSessionId(); // Ensure this line awaits the result.
      if (!sessionId) {
        throw new Error("Failed to retrieve session ID");
      }

      let checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: "_modal",
      };

      const response = await cashfree.checkout(checkoutOptions); // Wait for the checkout to complete
      console.log("Payment Initiated:", response); // Log the response to check if checkout was successful

      // Now, verify the payment
      if (
        response?.paymentDetails?.paymentMessage ===
        "Payment finished. Check status."
      ) {
        await newOrder(orderData);
        toast.success("Payment Verified");
        dispatch(resetCart());
        navigate("/orders");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const cashOnDelivery = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const res = await newOrder(orderData);
    dispatch(resetCart());
    responseToast(res, navigate, "/orders");
  };

  return (
    <div className="card">
      <button className="pay-now" onClick={handleClick}>
        Pay now
      </button>
      <button className="cash-on-delivery" onClick={cashOnDelivery}>
        Cash On Delivery
      </button>
    </div>
  );
};

export default Pay;

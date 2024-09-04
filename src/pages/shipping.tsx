import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingInfo } from "../redux/reducer/cartReducer";
import { RootState } from "../redux/store";

const Shipping = () => {
  const dispatch = useDispatch();
  
  const { cartItems } = useSelector(
    (state: RootState) => state.cartReducer
  );

  const navigate = useNavigate();
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  });

  const changeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    //It sets the previous value and new assign value to the name which is Shipping info category
    // We use [] because we can access the key without an error

    setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitHandler=(e:FormEvent<HTMLFormElement>)=>{
     e.preventDefault();
     dispatch(saveShippingInfo(shippingInfo));
     navigate("/pay");
  }

  useEffect(() => {
    if (cartItems.length === 0) return navigate("/cart");
  }, [cartItems]);

  return (
    <div className="shipping">
      <button className="back-btn" onClick={() => navigate("/cart")}>
        <BiArrowBack />
      </button>
      <form action="" onSubmit={submitHandler}>
        <h1>Shipping Address</h1>
        <input
          required
          type="text"
          placeholder="Address"
          name="address"
          value={shippingInfo.address}
          onChange={changeHandler}
        />

        <input
          required
          type="text"
          placeholder="City"
          name="city"
          value={shippingInfo.city}
          onChange={changeHandler}
        />

        <input
          required
          type="text"
          placeholder="State"
          name="state"
          value={shippingInfo.state}
          onChange={changeHandler}
        />

        <select
          name="country"
          required
          value={shippingInfo.country}
          onChange={changeHandler}
        >
          <option value="">Choose Country</option>
          <option value="India">India</option>
        </select>

        <input
          required
          type="number"
          placeholder="Pin Code"
          name="pinCode"
          value={shippingInfo.pinCode}
          onChange={changeHandler}
        />

        <button type="submit">Pay Now</button>
      </form>
    </div>
  );
};

export default Shipping;

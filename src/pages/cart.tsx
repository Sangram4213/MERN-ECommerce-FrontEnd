import axios from "axios";
import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartItem from "../components/cart-item";
import {
  addToCart,
  calculatePrice,
  discountApplied,
  removeCartItem,
} from "../redux/reducer/cartReducer";
import { RootState, server } from "../redux/store";
import { CartItem as CartItemTypes } from "../types/types";

const Cart = () => {
  const { cartItems, subtotal, tax, shippingCharges, discount, total } =
    useSelector(
      (state: RootState) => state.cartReducer
    );

  const dispatch = useDispatch();

  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);

  const incrementHandler = (cartItem: CartItemTypes) => {
    if (cartItem.stock <= cartItem.quantity) return;
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
  };

  const decrementHandler = (cartItem: CartItemTypes) => {
    if (cartItem.quantity <= 1) return;
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
  };

  const removeHandler = (id: string) => {
    dispatch(removeCartItem(id));
  };
  useEffect(() => {
    const { token: cancelToken, cancel } = axios.CancelToken.source();
    const timeOutID = setTimeout(() => {
      axios
        .get(`${server}/api/v1/payment/discount?coupon=${couponCode}`, {
          cancelToken,
        })
        .then((res) => {
          dispatch(discountApplied(res.data.discount));
          dispatch(calculatePrice());
          setIsValidCouponCode(true);
        })
        .catch(() => {
          setIsValidCouponCode(false);
          cancel();
          dispatch(discountApplied(0));
          dispatch(calculatePrice());
        });
    }, 1000);
    return () => {
      clearTimeout(timeOutID);
      setIsValidCouponCode(false);
    };
  }, [couponCode]);

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems]);

  return (
    <div className="cart">
      <main>
        {cartItems?.length > 0 ? (
          cartItems.map((i, idx) => (
            <CartItem
              key={idx}
              cartItem={i}
              incrementHandler={incrementHandler}
              decrementHandler={decrementHandler}
              removeHandler={removeHandler}
            />
          ))
        ) : (
          <h1>No Items Added</h1>
        )}
      </main>
      <aside>
        <p>SubTotal: ₹{subtotal}</p>
        <p>ShippingCharges: ₹{shippingCharges}</p>
        <p>Tax: ₹{tax}</p>
        <p>
          Discount: <em className="red"> - ₹{discount}</em>
        </p>
        <p>
          <b>Total: ₹{total}</b>
        </p>
        <input
          type="text"
          value={couponCode}
          placeholder="Coupon Code"
          onChange={(e) => setCouponCode(e.target.value)}
        />

        {couponCode &&
          (isValidCouponCode ? (
            <span className="green">
              ₹{discount} off using the <code>{couponCode}</code>
            </span>
          ) : (
            <span className="red">
              Invalid Coupon <VscError />
            </span>
          ))}

        {cartItems?.length > 0 && <Link to="/shipping">Checkout</Link>}
      </aside>
    </div>
  );
};

export default Cart;

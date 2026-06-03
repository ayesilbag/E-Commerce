import { Navigate } from "react-router-dom";

/** Tek checkout akışı: /order → /order/payment */
const Checkout = () => <Navigate to="/order" replace />;

export default Checkout;

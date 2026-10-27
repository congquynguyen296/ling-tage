export const PAYMENT_CONFIG = {
  providers: {
    cod: {
      id: "cod",
      label: "Cash on Delivery (COD)",
      description: "Pay upon receiving your order at your doorstep.",
    },
    online: {
      id: "online",
      label: "Online Payment (Card / PayOS QR)",
      description: "Instant online payment via credit card or VietQR PayOS.",
    },
  },
  freeShippingThreshold: 300,
};


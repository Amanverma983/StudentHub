/**
 * Razorpay Payment Integration Utility
 * This handles the checkout modal and returns a promise that resolves on success.
 */
export async function initializeRazorpayPayment({ amount, name, email, description }) {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.Razorpay) {
      reject(new Error('Razorpay SDK not loaded'));
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder', // Replace with real key in .env.local
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      name: 'StudentHub',
      description: description || 'Assignment Payment',
      image: '/logo.png', // Add your logo path
      prefill: {
        name: name || '',
        email: email || '',
      },
      theme: {
        color: '#7c3aed', // violet-600
      },
      handler: function (response) {
        // Payment successful
        resolve(response.razorpay_payment_id);
      },
      modal: {
        ondismiss: function () {
          reject(new Error('Payment cancelled'));
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  });
}

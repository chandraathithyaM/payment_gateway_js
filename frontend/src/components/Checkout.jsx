import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder, verifyPayment } from '../services/api';

/**
 * Checkout component — the main payment page.
 *
 * Flow:
 * 1. User enters name and amount
 * 2. "Pay Now" calls backend to create a Razorpay order
 * 3. Razorpay Checkout popup opens
 * 4. On success, signature is sent to backend for verification
 * 5. Navigates to /success or /failure based on result
 */
function Checkout({ addToast }) {
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Load Razorpay checkout script dynamically.
   * Returns a promise that resolves when the script is loaded.
   */
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  /**
   * Handle the payment flow.
   */
  const handlePayment = useCallback(async () => {
    // Validate inputs
    if (!customerName.trim()) {
      addToast('error', 'Please enter your name');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      addToast('error', 'Please enter a valid amount');
      return;
    }

    setLoading(true);

    try {
      // 1. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        addToast('error', 'Failed to load Razorpay SDK. Check your internet connection.');
        setLoading(false);
        return;
      }

      // 2. Create order on backend (amount in paise)
      const amountInPaise = Math.round(parseFloat(amount) * 100);
      const { order } = await createOrder(amountInPaise, customerName.trim());

      addToast('info', 'Order created! Complete payment in the popup.', 'Processing');

      // 3. Configure Razorpay Checkout options
      const options = {
        key: order.key_id || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'PayFlow Store',
        description: 'Secure Payment',
        order_id: order.id,
        prefill: {
          name: customerName.trim(),
          email: '',
          contact: '',
        },
        theme: {
          color: '#6c63ff',
        },
        // 4. Payment success handler
        handler: async (response) => {
          try {
            addToast('info', 'Verifying payment...', 'Almost done');

            // 5. Verify payment on backend
            const result = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (result.success) {
              addToast('success', 'Payment verified successfully!');
              navigate('/success', {
                state: {
                  payment: result.payment,
                },
              });
            } else {
              navigate('/failure', {
                state: {
                  error: result.message || 'Payment verification failed',
                },
              });
            }
          } catch (err) {
            navigate('/failure', {
              state: {
                error: err.response?.data?.message || 'Payment verification failed',
              },
            });
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            addToast('info', 'Payment was cancelled', 'Cancelled');
          },
        },
      };

      // 6. Open Razorpay Checkout popup
      const razorpay = new window.Razorpay(options);

      razorpay.on('payment.failed', (response) => {
        setLoading(false);
        navigate('/failure', {
          state: {
            error: response.error?.description || 'Payment failed',
            code: response.error?.code,
          },
        });
      });

      razorpay.open();
      setLoading(false);
    } catch (error) {
      console.error('Payment error:', error);
      const message =
        error.response?.data?.message || 'Failed to create order. Please try again.';
      addToast('error', message);
      setLoading(false);
    }
  }, [customerName, amount, addToast, navigate]);

  return (
    <div className="page">
      <div className="checkout-container">
        {/* Header */}
        <div className="checkout-header">
          <h1 className="gradient-text">Checkout</h1>
          <p>Complete your purchase securely</p>
        </div>

        {/* Card */}
        <div className="glass-card checkout-card">
          {/* Product Preview */}
          <div className="product-preview">
            <div className="product-icon">🛍️</div>
            <div className="product-details">
              <h3>Premium Product</h3>
              <p>Enter your details below to proceed with payment</p>
            </div>
          </div>

          {/* Customer Name */}
          <div className="form-group">
            <label htmlFor="customer-name">Full Name</label>
            <input
              id="customer-name"
              type="text"
              className="input-field"
              placeholder="Enter your full name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Amount */}
          <div className="form-group">
            <label htmlFor="payment-amount">Amount (₹)</label>
            <div className="input-with-prefix">
              <span className="input-prefix">₹</span>
              <input
                id="payment-amount"
                type="number"
                className="input-field"
                placeholder="0.00"
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Amount Summary */}
          {amount && parseFloat(amount) > 0 && (
            <div className="amount-display">
              <span className="label">Total Amount</span>
              <span className="value gradient-text">
                ₹{parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          {/* Pay Button */}
          <button
            id="pay-now-btn"
            className="btn btn-primary pay-button"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Processing...
              </>
            ) : (
              <>
                <span className="btn-icon">🔐</span>
                Pay Now
              </>
            )}
          </button>

          {/* Secure Badge */}
          <div className="secure-badge">
            <span className="lock-icon">🔒</span>
            Secured by Razorpay • 256-bit SSL encryption
          </div>
        </div>

        {/* Footer */}
        <div className="powered-by">
          Powered by <span>PayFlow</span> × Razorpay
        </div>
      </div>
    </div>
  );
}

export default Checkout;

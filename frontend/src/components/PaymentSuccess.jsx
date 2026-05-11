import { useLocation, useNavigate, Link } from 'react-router-dom';

/**
 * PaymentSuccess — displays after a successful payment verification.
 * Shows transaction details received from the backend via router state.
 */
function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const payment = location.state?.payment;

  // If no payment data, redirect to checkout
  if (!payment) {
    return (
      <div className="page">
        <div className="success-container">
          <div className="glass-card success-card">
            <div className="success-icon-wrapper">
              <span className="success-checkmark">?</span>
            </div>
            <h1>No Payment Data</h1>
            <p className="subtitle">It seems you landed here by mistake.</p>
            <div className="success-actions">
              <Link to="/" className="btn btn-primary">
                Go to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Format paise amount to INR display string.
   */
  const formatAmount = (paise) => {
    const rupees = paise / 100;
    return `₹${rupees.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="page">
      <div className="success-container">
        <div className="glass-card success-card">
          {/* Success Icon */}
          <div className="success-icon-wrapper">
            <span className="success-checkmark">✓</span>
          </div>

          <h1>Payment Successful!</h1>
          <p className="subtitle">
            Thank you, {payment.customer_name}! Your transaction is complete.
          </p>

          {/* Transaction Details */}
          <div className="transaction-details">
            <div className="detail-header">Transaction Details</div>

            <div className="detail-row">
              <span className="detail-label">Payment ID</span>
              <span className="detail-value">{payment.payment_id}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Order ID</span>
              <span className="detail-value">{payment.order_id}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Amount</span>
              <span className="detail-value">{formatAmount(payment.amount)}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Currency</span>
              <span className="detail-value">{payment.currency}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Status</span>
              <span className="detail-value">
                <span className="status-badge success">
                  {payment.status}
                </span>
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="success-actions">
            <button
              className="btn btn-primary"
              onClick={() => navigate('/')}
              id="back-to-shop-btn"
            >
              🛍️ Back to Shop
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => window.print()}
              id="print-receipt-btn"
            >
              🖨️ Print Receipt
            </button>
          </div>
        </div>

        <div className="powered-by">
          Powered by <span>PayFlow</span> × Razorpay
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;

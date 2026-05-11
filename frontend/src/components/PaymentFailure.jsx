import { useLocation, useNavigate } from 'react-router-dom';

/**
 * PaymentFailure — displayed when payment fails or is rejected.
 * Shows error details and provides retry options.
 */
function PaymentFailure() {
  const location = useLocation();
  const navigate = useNavigate();
  const error = location.state?.error || 'An unexpected error occurred during payment.';
  const errorCode = location.state?.code;

  return (
    <div className="page">
      <div className="failure-container">
        <div className="glass-card failure-card">
          {/* Failure Icon */}
          <div className="failure-icon-wrapper">
            <span className="failure-icon">✕</span>
          </div>

          <h1>Payment Failed</h1>
          <p className="subtitle">
            We couldn't process your payment. Please try again.
          </p>

          {/* Error Details */}
          <div className="error-detail">
            <strong>Error:</strong> {error}
            {errorCode && (
              <>
                <br />
                <strong>Code:</strong> {errorCode}
              </>
            )}
          </div>

          {/* Actions */}
          <div className="failure-actions">
            <button
              className="btn btn-primary"
              onClick={() => navigate('/')}
              id="try-again-btn"
            >
              🔄 Try Again
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/')}
              id="back-home-btn"
            >
              🏠 Back to Home
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

export default PaymentFailure;

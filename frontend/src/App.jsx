import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Checkout from './components/Checkout';
import PaymentSuccess from './components/PaymentSuccess';
import PaymentFailure from './components/PaymentFailure';
import { Toast, useToast } from './components/Toast';
import './App.css';

/**
 * App — Root component with routing.
 *
 * Routes:
 *   /          → Checkout page
 *   /success   → Payment success page
 *   /failure   → Payment failure page
 */
function App() {
  const { toasts, addToast, removeToast } = useToast();

  return (
    <>
      <Toast toasts={toasts} removeToast={removeToast} />
      <Navbar />
      <Routes>
        <Route path="/" element={<Checkout addToast={addToast} />} />
        <Route path="/success" element={<PaymentSuccess />} />
        <Route path="/failure" element={<PaymentFailure />} />
      </Routes>
    </>
  );
}

export default App;

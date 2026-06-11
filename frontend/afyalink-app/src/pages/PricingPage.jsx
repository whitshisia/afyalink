import React from 'react';
import { useNavigate } from 'react-router-dom';
import Pricing from '../components/Home/Pricing';

const PricingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-20">
        <Pricing />
      </div>
    </div>
  );
};

export default PricingPage;
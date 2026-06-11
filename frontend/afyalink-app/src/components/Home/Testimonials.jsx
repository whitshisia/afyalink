import React, { useEffect, useState } from 'react';
import { doctorService } from '../../services/doctorService';

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedReviews();
  }, []);

  const loadFeaturedReviews = async () => {
    try {
      // Fetch some doctors and their reviews
      const doctors = await doctorService.getAll({ limit: 3 });
      const allReviews = [];
      
      for (const doctor of doctors) {
        const doctorReviews = await doctorService.getReviews(doctor.id, { limit: 1 });
        if (doctorReviews.length > 0) {
          allReviews.push({
            ...doctorReviews[0],
            doctorName: doctor.user?.full_name,
            doctorSpecialty: doctor.specializations?.[0]?.name
          });
        }
      }
      
      setReviews(allReviews.slice(0, 3));
    } catch (error) {
      console.error('Failed to load reviews:', error);
      // Fallback data
      setReviews([
        {
          rating: 5,
          comment: "I booked a consultation at midnight when my daughter had a fever. The doctor responded within minutes. AfyaLink is a genuine lifesaver for families.",
          patient_name: "Amina Wanjiru",
          role: "Mother of 3 · Nairobi",
          is_verified: true
        },
        {
          rating: 5,
          comment: "Getting my lab results digitally and having the doctor explain them in a follow-up call was incredibly convenient. No more queuing at the hospital.",
          patient_name: "James Ochieng",
          role: "Business Owner · Kisumu",
          is_verified: true
        },
        {
          rating: 5,
          comment: "The mental health support is confidential and professional. It's made a real difference in my wellbeing — I recommend it to everyone I know.",
          patient_name: "Faith Muthoni",
          role: "Teacher · Mombasa",
          is_verified: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-[100px] bg-gray-50">
        <div className="max-w-[1160px] mx-auto px-10 text-center">
          <div className="animate-pulse">Loading testimonials...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-[100px] bg-gray-50" id="testimonials">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="max-w-[500px] mb-14 reveal">
          <div className="eyebrow">Testimonials</div>
          <h2 className="text-[42px] font-extrabold leading-[1.1] tracking-[-1.5px] text-gray-950">
            Trusted by patients<br /><em className="not-italic text-brand-500">across Kenya.</em>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 reveal">
          {reviews.map((review, index) => (
            <div 
              key={index} 
              className={`rounded-[24px] border p-7 transition-all hover:shadow-md hover:-translate-y-0.5 ${
                index === 1 ? 'bg-brand-800 border-transparent' : 'bg-white border-gray-200'
              }`}
            >
              <div className="mb-3.5">
                <span className="text-amber-500 text-sm tracking-[1px]">
                  {'★'.repeat(Math.floor(review.rating || 5))}
                  {'☆'.repeat(5 - Math.floor(review.rating || 5))}
                </span>
              </div>
              <div className={`text-[15px] leading-[1.75] mb-5 italic ${
                index === 1 ? 'text-white/80' : 'text-gray-700'
              }`}>
                "{review.comment}"
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-display text-[13px] font-bold text-white ${
                  index === 1 ? 'bg-white/15' : 'bg-brand-600'
                }`}>
                  {review.patient_name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div className={`font-display text-sm font-semibold ${
                    index === 1 ? 'text-white' : 'text-gray-900'
                  }`}>
                    {review.patient_name}
                  </div>
                  <div className={`text-xs ${
                    index === 1 ? 'text-white/50' : 'text-gray-400'
                  }`}>
                    {review.role || 'Patient'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
import React, { useState } from 'react';
import axios from 'axios';

const SubmitUpdatePage = () => {
  const [message, setMessage] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message || !latitude || !longitude) {
      setFeedbackMessage('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/submit-update', {
        message,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      });
      
      if (response.status === 200) {
        setFeedbackMessage('Update submitted successfully!');
        setMessage('');
        setLatitude('');
        setLongitude('');
      } else {
        setFeedbackMessage('Failed to submit update. Please try again.');
      }
    } catch (error) {
      setFeedbackMessage('Error: Unable to submit update. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="update-form">
      <h3>Submit Route Update</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          name="message"
          placeholder="Enter update message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <input
          type="number"
          name="latitude"
          placeholder="Enter latitude"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          required
        />
        <input
          type="number"
          name="longitude"
          placeholder="Enter longitude"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          required
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Update'}
        </button>
      </form>
      {feedbackMessage && <p>{feedbackMessage}</p>}
    </div>
  );
};

export default SubmitUpdatePage;

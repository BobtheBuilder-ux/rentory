import React from 'react';

const PasswordResetEmail = ({ firstName, resetLink }) => {
  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f2f2f2',
    padding: '20px',
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '40px',
    maxWidth: '600px',
    margin: '0 auto',
    textAlign: 'center',
  };

  const headingStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333333',
  };

  const textStyle = {
    fontSize: '16px',
    color: '#666666',
    lineHeight: '1.5',
  };

  const buttonStyle = {
    backgroundColor: 'hsl(0 0% 9%)',
    color: 'hsl(0 0% 98%)',
    padding: '15px 30px',
    borderRadius: '5px',
    textDecoration: 'none',
    display: 'inline-block',
    marginTop: '20px',
    fontWeight: 'bold',
  };

  const footerStyle = {
    marginTop: '30px',
    fontSize: '14px',
    color: '#999999',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={headingStyle}>Reset Your Rentory Password</h1>
        <p style={textStyle}>Hi {firstName},</p>
        <p style={textStyle}>
          We received a request to reset your Rentory password. If this was you, click the link below to set a new password:
        </p>
        <a href={resetLink} style={buttonStyle}>
          Reset My Password
        </a>
        <p style={textStyle}>This link will expire in 30 minutes for security reasons.</p>
        <p style={textStyle}>If you didn’t request this, you can safely ignore this message.</p>
        <p style={footerStyle}>
          Need help? Contact support@rentory.ng
        </p>
        <p style={footerStyle}>
          Stay safe,
          <br />
          The Rentory Team
        </p>
      </div>
    </div>
  );
};

export default PasswordResetEmail;

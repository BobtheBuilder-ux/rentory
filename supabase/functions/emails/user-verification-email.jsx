import React from 'react';

const UserVerificationEmail = ({ firstName, verificationLink }) => {
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
        <h1 style={headingStyle}>Verify Your Rentory Account</h1>
        <p style={textStyle}>Hi {firstName},</p>
        <p style={textStyle}>
          Welcome to Rentory — your smarter way to find or lease a home in Nigeria. To activate your account and start exploring verified listings, please confirm your email address.
        </p>
        <p style={textStyle}>👇 Click the button below to verify your email:</p>
        <a href={verificationLink} style={buttonStyle}>
          Verify My Email
        </a>
        <p style={footerStyle}>
          If you didn’t sign up for Rentory, please ignore this message.
        </p>
        <p style={footerStyle}>
          Thank you,
          <br />
          The Rentory Team
          <br />
          <a href="https://www.rentory.ng" style={{ color: '#999999' }}>www.rentory.ng</a>
        </p>
      </div>
    </div>
  );
};

export default UserVerificationEmail;

import React from 'react';

const SearchAlertEmail = ({ firstName, searchParams, listingsLink, updatePreferencesLink }) => {
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
        <h1 style={headingStyle}>New Homes That Match Your Search on Rentory 🏡</h1>
        <p style={textStyle}>Hi {firstName},</p>
        <p style={textStyle}>
          Good news! We found new listings that match your search:
          <br />
          📍 {searchParams.city}
          <br />
          💰 {searchParams.priceRange}
          <br />
          🏠 {searchParams.keywords}
        </p>
        <p style={textStyle}>Check them out now before they’re gone:</p>
        <a href={listingsLink} style={buttonStyle}>
          View Listings
        </a>
        <p style={textStyle}>You’ll continue to receive updates as new homes become available.</p>
        <p style={textStyle}>Need to adjust your search filters?</p>
        <a href={updatePreferencesLink} style={buttonStyle}>
          Update Search Preferences
        </a>
        <p style={footerStyle}>
          Happy house hunting,
          <br />
          The Rentory Team
        </p>
      </div>
    </div>
  );
};

export default SearchAlertEmail;

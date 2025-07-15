import { analytics } from './firebase';
import { logEvent } from 'firebase/analytics';

// Custom event types
export const EventType = {
  PROPERTY_VIEW: 'property_view',
  PROPERTY_INQUIRY: 'property_inquiry',
  PROPERTY_APPLICATION: 'property_application',
  PROPERTY_SAVE: 'property_save',
  PROPERTY_UNSAVE: 'property_unsave',
  PROPERTY_LIST: 'property_list',
  USER_REGISTRATION: 'user_registration',
  USER_LOGIN: 'user_login',
  USER_VERIFICATION: 'user_verification',
  SEARCH_PERFORMED: 'search_performed',
  MESSAGE_SENT: 'message_sent',
  APPLICATION_STATUS_CHANGE: 'application_status_change'
};

// Track property views
export const trackPropertyView = (propertyId, propertyData) => {
  if (!analytics) return;
  
  logEvent(analytics, EventType.PROPERTY_VIEW, {
    property_id: propertyId,
    property_type: propertyData.property_type,
    price: propertyData.price,
    location: propertyData.location
  });
};

// Track property inquiries
export const trackPropertyInquiry = (propertyId, inquiryType) => {
  if (!analytics) return;

  logEvent(analytics, EventType.PROPERTY_INQUIRY, {
    property_id: propertyId,
    inquiry_type: inquiryType
  });
};

// Track property applications
export const trackPropertyApplication = (propertyId, applicationType) => {
  if (!analytics) return;

  logEvent(analytics, EventType.PROPERTY_APPLICATION, {
    property_id: propertyId,
    application_type: applicationType
  });
};

// Track saved properties
export const trackPropertySave = (propertyId, userId) => {
  if (!analytics) return;

  logEvent(analytics, EventType.PROPERTY_SAVE, {
    property_id: propertyId,
    user_id: userId
  });
};

// Track property listing
export const trackPropertyListing = (propertyData) => {
  if (!analytics) return;

  logEvent(analytics, EventType.PROPERTY_LIST, {
    property_type: propertyData.property_type,
    price: propertyData.price,
    location: propertyData.location,
    bedrooms: propertyData.bedrooms,
    bathrooms: propertyData.bathrooms
  });
};

// Track user registration
export const trackUserRegistration = (userType) => {
  if (!analytics) return;

  logEvent(analytics, EventType.USER_REGISTRATION, {
    user_type: userType
  });
};

// Track user login
export const trackUserLogin = (method) => {
  if (!analytics) return;

  logEvent(analytics, EventType.USER_LOGIN, {
    login_method: method
  });
};

// Track user verification
export const trackUserVerification = (userId, status) => {
  if (!analytics) return;

  logEvent(analytics, EventType.USER_VERIFICATION, {
    user_id: userId,
    verification_status: status
  });
};

// Track search events
export const trackSearch = (searchParams) => {
  if (!analytics) return;

  logEvent(analytics, EventType.SEARCH_PERFORMED, {
    search_params: searchParams
  });
};

// Track messages
export const trackMessage = (conversationId, messageType = 'text') => {
  if (!analytics) return;

  logEvent(analytics, EventType.MESSAGE_SENT, {
    conversation_id: conversationId,
    message_type: messageType
  });
};

// Track application status changes
export const trackApplicationStatus = (applicationId, newStatus, oldStatus) => {
  if (!analytics) return;

  logEvent(analytics, EventType.APPLICATION_STATUS_CHANGE, {
    application_id: applicationId,
    new_status: newStatus,
    old_status: oldStatus
  });
};
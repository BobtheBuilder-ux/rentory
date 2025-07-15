const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

// Optimize function configuration for free tier
const runtimeOpts = {
  timeoutSeconds: 120, // Reduced timeout
  memory: '256MB', // Minimum memory
  minInstances: 0 // No minimum instances to save resources
};

// Essential functions only for free tier
exports.onPropertyUpdate = functions
  .runWith(runtimeOpts)
  .firestore.document('properties/{propertyId}')
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const previousData = change.before.data();
    
    // Only process significant changes to save function invocations
    if (newData.price === previousData.price && 
        newData.status === previousData.status) {
      return null;
    }

    // Batch write to save operations
    const batch = db.batch();
    
    // Get users who saved this property (limited to 10 to stay within limits)
    const savedPropertiesSnapshot = await db
      .collection('saved_properties')
      .where('property_id', '==', context.params.propertyId)
      .limit(10)
      .get();
    
    savedPropertiesSnapshot.docs.forEach((doc) => {
      batch.create(db.collection('notifications').doc(), {
        user_id: doc.data().user_id,
        type: 'property_update',
        property_id: context.params.propertyId,
        read: false,
        created_at: admin.firestore.FieldValue.serverTimestamp()
      });
    });

    return batch.commit();
  });

exports.onNewApplication = functions
  .runWith(runtimeOpts)
  .firestore.document('applications/{applicationId}')
  .onCreate(async (snap, context) => {
    const application = snap.data();
    
    // Single write operation for notification
    return db.collection('notifications').add({
      user_id: application.landlord_id,
      type: 'new_application',
      application_id: context.params.applicationId,
      read: false,
      created_at: admin.firestore.FieldValue.serverTimestamp()
    });
  });

exports.onApplicationStatusChange = functions
  .runWith(runtimeOpts)
  .firestore.document('applications/{applicationId}')
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const previousData = change.before.data();
    
    // Only process status changes
    if (newData.status === previousData.status) {
      return null;
    }

    // Single write operation for notification
    return db.collection('notifications').add({
      user_id: newData.applicant_id,
      type: 'application_status_change',
      application_id: context.params.applicationId,
      status: newData.status,
      read: false,
      created_at: admin.firestore.FieldValue.serverTimestamp()
    });
  });

// Cleanup function - runs only when necessary
exports.cleanupOldNotifications = functions
  .runWith(runtimeOpts)
  .pubsub.schedule('every 24 hours')
  .onRun(async (context) => {
    const thirtyDaysAgo = admin.firestore.Timestamp.fromDate(
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );

    // Delete old notifications in batches to stay within limits
    const oldNotifications = await db
      .collection('notifications')
      .where('created_at', '<', thirtyDaysAgo)
      .limit(100)
      .get();

    const batch = db.batch();
    oldNotifications.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    return batch.commit();
  });
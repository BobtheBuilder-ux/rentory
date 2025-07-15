import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadFile = async (file, folder) => {
  try {
    // Create form data for upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'rentory_uploads');
    formData.append('folder', folder);

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error uploading file');
    }

    return {
      url: data.secure_url,
      public_id: data.public_id,
      error: null
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { error };
  }
};

export const deleteFile = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return { result, error: null };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { error };
  }
};

export const uploadPropertyImages = async (propertyId, files) => {
  try {
    const uploadPromises = files.map((file) => {
      return uploadFile(file, `properties/${propertyId}`);
    });

    const results = await Promise.all(uploadPromises);
    const errors = results.filter(result => result.error);

    if (errors.length > 0) {
      throw new Error('Some images failed to upload');
    }

    return {
      data: results.map(result => ({
        url: result.url,
        public_id: result.public_id
      })),
      error: null
    };
  } catch (error) {
    console.error('Error uploading property images:', error);
    return { data: null, error };
  }
};

export const uploadProfileImage = async (userId, file) => {
  try {
    const { url, public_id, error } = await uploadFile(file, `profiles/${userId}`);
    
    if (error) throw error;

    return {
      data: { url, public_id },
      error: null
    };
  } catch (error) {
    console.error('Error uploading profile image:', error);
    return { data: null, error };
  }
};

export const uploadVerificationDocuments = async (userId, files) => {
  try {
    const uploadPromises = files.map((file) => {
      return uploadFile(file, `verification/${userId}`);
    });

    const results = await Promise.all(uploadPromises);
    const errors = results.filter(result => result.error);

    if (errors.length > 0) {
      throw new Error('Some documents failed to upload');
    }

    return {
      data: results.map(result => ({
        url: result.url,
        public_id: result.public_id
      })),
      error: null
    };
  } catch (error) {
    console.error('Error uploading verification documents:', error);
    return { data: null, error };
  }
};
import { supabase } from './db';

export const uploadFile = async (file, bucket, path) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);

    if (error) {
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);

    return {
      url: publicUrl,
      path: data.path,
      error: null,
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { error };
  }
};

export const deleteFile = async (bucket, path) => {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) {
      throw error;
    }
    return { error: null };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { error };
  }
};

export const uploadPropertyImages = async (propertyId, files) => {
  try {
    const uploadPromises = files.map((file) => {
      const fileName = `${Date.now()}-${file.name}`;
      return uploadFile(file, 'properties', `${propertyId}/${fileName}`);
    });

    const results = await Promise.all(uploadPromises);
    const errors = results.filter((result) => result.error);

    if (errors.length > 0) {
      throw new Error('Some images failed to upload');
    }

    return {
      data: results.map((result) => ({
        url: result.url,
        path: result.path,
      })),
      error: null,
    };
  } catch (error) {
    console.error('Error uploading property images:', error);
    return { data: null, error };
  }
};

export const uploadProfileImage = async (userId, file) => {
  try {
    const fileName = `${Date.now()}-${file.name}`;
    const { url, path, error } = await uploadFile(
      file,
      'profiles',
      `${userId}/${fileName}`
    );

    if (error) throw error;

    return {
      data: { url, path },
      error: null,
    };
  } catch (error) {
    console.error('Error uploading profile image:', error);
    return { data: null, error };
  }
};

export const uploadVerificationDocuments = async (userId, files) => {
  try {
    const uploadPromises = files.map((file) => {
      const fileName = `${Date.now()}-${file.name}`;
      return uploadFile(file, 'verification', `${userId}/${fileName}`);
    });

    const results = await Promise.all(uploadPromises);
    const errors = results.filter((result) => result.error);

    if (errors.length > 0) {
      throw new Error('Some documents failed to upload');
    }

    return {
      data: results.map((result) => ({
        url: result.url,
        path: result.path,
      })),
      error: null,
    };
  } catch (error) {
    console.error('Error uploading verification documents:', error);
    return { data: null, error };
  }
};

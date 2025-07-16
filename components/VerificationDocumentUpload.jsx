'use client';

import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { uploadVerificationDocuments } from '@/lib/storage';

export default function VerificationDocumentUpload({ userId, onComplete }) {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      preview: URL.createObjectURL(file)
    }))]);
  };

  const removeFile = (fileId) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.length) {
      toast({
        title: 'Error',
        description: 'Please select at least one document to upload',
        variant: 'destructive'
      });
      return;
    }

    setIsUploading(true);
    try {
      const { data, error } = await uploadVerificationDocuments(
        userId, 
        files.map(f => f.file)
      );
      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Documents uploaded successfully!'
      });

      // Clean up previews
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
      setFiles([]);

      if (onComplete) {
        onComplete(data);
      }
    } catch (error) {
      console.error('Error uploading documents:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload documents. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verification Documents</CardTitle>
        <CardDescription>
          Upload required documents to verify your account. We accept government-issued ID, proof of ownership, or business registration documents.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>Upload Documents</Label>
            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                Upload your verification documents
              </p>
              <p className="text-sm text-gray-500 mb-4">
                PDF, JPG, PNG or WebP files up to 5MB each
              </p>
              <Input
                type="file"
                multiple
                accept=".pdf,image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="document-upload"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('document-upload').click()}
              >
                Choose Files
              </Button>
            </div>
          </div>

          {files.length > 0 && (
            <div>
              <Label>Selected Documents ({files.length})</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {files.map((file) => (
                  <div key={file.id} className="relative">
                    {file.file.type.startsWith('image/') ? (
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-sm text-gray-600 px-2 text-center break-words">
                          {file.name}
                        </p>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={isUploading || !files.length}
          >
            {isUploading ? 'Uploading...' : 'Upload Documents'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
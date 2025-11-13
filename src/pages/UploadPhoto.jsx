import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { toast } from 'sonner';

export default function UploadPhoto() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      toast.error('Please select an image to upload');
      return;
    }

    if (!caption.trim()) {
      toast.error('Please add a caption');
      return;
    }

    setIsUploading(true);
    try {
      // Create photo with caption and other details
      const postData = {
        email: user.email,
        dataUrl: selectedImage,
        caption: caption,
        location: location,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      await api.post('/gallery/photos', postData);
      
      toast.success('Photo uploaded successfully!');
      navigate('/gallery');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Upload Travel Photo</h1>
            <Button variant="ghost" onClick={() => navigate('/gallery')}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Photo</Label>
              {selectedImage ? (
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-muted-foreground rounded-lg p-8 text-center">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <Label htmlFor="image-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Camera className="h-10 w-10 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Click to upload a photo
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Max file size: 5MB
                      </p>
                    </div>
                  </Label>
                </div>
              )}
            </div>

            {/* Caption */}
            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                placeholder="Describe your travel moment..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={3}
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Where was this photo taken?"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="Add tags separated by commas (e.g., beach, sunset, adventure)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>

            {/* Upload Button */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => navigate('/gallery')}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={isUploading || !selectedImage}
                className="bg-accent hover:bg-accent/90"
              >
                {isUploading ? (
                  <>
                    <Upload className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Post Photo
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
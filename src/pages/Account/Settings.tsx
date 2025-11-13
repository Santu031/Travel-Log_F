import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '@/services/api';

export default function Settings() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState('');
  const [privateAccount, setPrivateAccount] = useState(false);
  const [avatarSeed, setAvatarSeed] = useState(user?.name || 'user');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Generate avatar URL when avatarSeed changes
  useEffect(() => {
    setAvatarUrl(`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(avatarSeed)}`);
  }, [avatarSeed]);

  // Initialize avatar seed from user name
  useEffect(() => {
    if (user?.name) {
      setAvatarSeed(user.name);
    }
  }, [user?.name]);

  if (!user) {
    navigate('/account/login');
    return null;
  }

  const handleSave = async () => {
    try {
      // Update user profile with avatar
      const response = await api.put('/auth/profile', {
        name,
        avatar: avatarUrl
      });
      
      updateUser(response.data.user);
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    }
  };

  const handleAvatarSeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarSeed(e.target.value);
  };

  const generateRandomAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(2, 15);
    setAvatarSeed(randomSeed);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences</p>
          </div>

          {/* Profile Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
            <div className="space-y-6">
              {/* Avatar Section */}
              <div className="space-y-4">
                <Label>Profile Avatar</Label>
                <div className="flex items-center gap-6">
                  <img 
                    src={avatarUrl} 
                    alt="Avatar preview" 
                    className="w-20 h-20 rounded-full border-2 border-primary"
                  />
                  <div className="flex-1 space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="avatarSeed">Avatar Seed</Label>
                      <Input
                        id="avatarSeed"
                        value={avatarSeed}
                        onChange={handleAvatarSeedChange}
                        placeholder="Enter name or any text for avatar"
                      />
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={generateRandomAvatar}
                    >
                      Generate Random Avatar
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your avatar is generated using DiceBear Avataaars. Change the seed text to get a different avatar.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="displayName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    value={user.email}
                    disabled
                    className="pl-10 bg-muted"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself and your travel experiences..."
                  rows={4}
                />
              </div>
            </div>
          </Card>

          {/* Privacy Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Privacy Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Private Account</Label>
                  <p className="text-sm text-muted-foreground">
                    Only approved followers can see your posts
                  </p>
                </div>
                <Switch
                  checked={privateAccount}
                  onCheckedChange={setPrivateAccount}
                />
              </div>
            </div>
          </Card>

          {/* Password */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Password</h2>
            <Button variant="outline">
              <Lock className="mr-2 h-4 w-4" />
              Change Password
            </Button>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => navigate('/account/profile')}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
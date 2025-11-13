import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Grid3x3, Heart, MessageCircle, Loader2, UserPlus, UserCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/services/api';

interface Post {
  id: string;
  dataUrl: string;
  caption: string;
  createdAt: string;
}

interface UserProfile {
  email: string;
  name: string;
  photos: Post[];
}

export default function UserProfile() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/gallery/friends/profile?email=${userId}`);
      setUserProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      navigate('/gallery');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!currentUser) {
      navigate('/account/login');
      return;
    }

    try {
      if (isFollowing) {
        // Unfollow
        await api.delete('/gallery/friends', {
          data: { email: currentUser.email, friendEmail: userProfile?.email }
        });
      } else {
        // Follow
        await api.post('/gallery/friends', {
          email: currentUser.email,
          friendEmail: userProfile?.email
        });
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Failed to update follow status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="text-center py-12">
        <p>User not found</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden py-8">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920" 
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-secondary/50 to-accent/60 backdrop-blur-[2px]" />
      </div>

      {/* Floating elements */}
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-20 right-20 w-32 h-32 bg-primary/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-40 left-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 max-w-4xl relative z-10 pb-12">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center gap-8">
            {/* Avatar */}
            <Avatar className="h-32 w-32 border-4 border-white/30">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userProfile.name)}`} alt={userProfile.name} />
              <AvatarFallback className="text-4xl bg-gradient-to-br from-primary to-accent text-white">
                {userProfile.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-white">{userProfile.name}</h1>
                {currentUser && currentUser.email !== userProfile.email && (
                  <Button 
                    onClick={handleFollow}
                    className="glass backdrop-blur-md bg-white/20 border border-white/30 text-white hover:bg-white/30"
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="mr-2 h-4 w-4" />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Follow
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Stats */}
              <div className="flex gap-8">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{userProfile.photos.length}</p>
                  <p className="text-sm text-white/70">posts</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">0</p>
                  <p className="text-sm text-white/70">followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">0</p>
                  <p className="text-sm text-white/70">following</p>
                </div>
              </div>

              <p className="text-white/80">Travel enthusiast sharing adventures from around the world</p>
            </div>
          </div>
        </motion.div>

        {/* Posts Grid Header */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Grid3x3 className="h-5 w-5 text-white" />
          <span className="text-white font-semibold uppercase tracking-wider text-sm">Posts</span>
        </div>

        {/* Posts Grid */}
        {userProfile.photos.length > 0 ? (
          <div className="grid grid-cols-3 gap-1 md:gap-2">
            {userProfile.photos.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="relative aspect-square group cursor-pointer overflow-hidden rounded-lg"
              >
                <img 
                  src={post.dataUrl} 
                  alt={post.caption}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6">
                  <div className="flex items-center gap-2 text-white">
                    <Heart className="h-6 w-6 fill-white" />
                    <span className="font-semibold">0</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <MessageCircle className="h-6 w-6 fill-white" />
                    <span className="font-semibold">0</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-12 text-center">
            <Grid3x3 className="h-16 w-16 mx-auto text-white/50 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
            <p className="text-white/70">
              This user hasn't shared any travel moments yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
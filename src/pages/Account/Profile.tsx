import { motion } from 'framer-motion';
import { Edit, Grid3x3, Heart, MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { mockPosts } from '@/services/mockData';

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/account/login');
    return null;
  }

  // Filter posts by current user
  const userPosts = mockPosts.filter(post => post.userId === user.id);

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
              <AvatarImage src={user.avatar} alt={user.displayName} />
              <AvatarFallback className="text-4xl bg-gradient-to-br from-primary to-accent text-white">
                {user.displayName[0]}
              </AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-white">{user.displayName}</h1>
                <Button 
                  onClick={() => navigate('/account/settings')}
                  className="glass backdrop-blur-md bg-white/20 border border-white/30 text-white hover:bg-white/30"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </div>

              {/* Stats */}
              <div className="flex gap-8">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{userPosts.length}</p>
                  <p className="text-sm text-white/70">posts</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">
                    {userPosts.reduce((sum, post) => sum + post.likes, 0)}
                  </p>
                  <p className="text-sm text-white/70">likes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">
                    {userPosts.reduce((sum, post) => sum + post.comments, 0)}
                  </p>
                  <p className="text-sm text-white/70">comments</p>
                </div>
              </div>

              {user.bio && (
                <p className="text-white/80">{user.bio}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Posts Grid Header */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Grid3x3 className="h-5 w-5 text-white" />
          <span className="text-white font-semibold uppercase tracking-wider text-sm">Posts</span>
        </div>

        {/* Posts Grid */}
        {userPosts.length > 0 ? (
          <div className="grid grid-cols-3 gap-1 md:gap-2">
            {userPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="relative aspect-square group cursor-pointer overflow-hidden rounded-lg"
              >
                <img 
                  src={post.images[0]} 
                  alt={post.caption}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6">
                  <div className="flex items-center gap-2 text-white">
                    <Heart className="h-6 w-6 fill-white" />
                    <span className="font-semibold">{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <MessageCircle className="h-6 w-6 fill-white" />
                    <span className="font-semibold">{post.comments}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-12 text-center">
            <Grid3x3 className="h-16 w-16 mx-auto text-white/50 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
            <p className="text-white/70 mb-4">
              Start sharing your travel adventures!
            </p>
            <Button 
              onClick={() => navigate('/gallery')}
              className="glass backdrop-blur-md bg-white/20 border border-white/30 text-white hover:bg-white/30"
            >
              Upload Your First Post
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

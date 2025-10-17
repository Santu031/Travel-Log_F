import { motion } from 'framer-motion';
import { MapPin, Calendar, Edit } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PostCard from '@/components/PostCard';
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
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Profile Header */}
        <Card className="p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="h-32 w-32">
              <AvatarImage src={user.avatar} alt={user.displayName} />
              <AvatarFallback className="text-4xl">{user.displayName[0]}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">{user.displayName}</h1>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
                <Button onClick={() => navigate('/account/settings')}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </div>

              {user.bio && (
                <p className="text-muted-foreground">{user.bio}</p>
              )}

              <div className="flex flex-wrap gap-6 pt-4 border-t">
                <div>
                  <p className="text-2xl font-bold">{userPosts.length}</p>
                  <p className="text-sm text-muted-foreground">Posts</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {userPosts.reduce((sum, post) => sum + post.likesCount, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Likes</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {userPosts.reduce((sum, post) => sum + post.commentsCount, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Comments</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* User Posts */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">My Posts</h2>
            <Button onClick={() => navigate('/gallery')}>
              <MapPin className="mr-2 h-4 w-4" />
              View Gallery
            </Button>
          </div>

          {userPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPosts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <MapPin className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-4">
                Start sharing your travel adventures!
              </p>
              <Button onClick={() => navigate('/gallery')}>Upload Your First Post</Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

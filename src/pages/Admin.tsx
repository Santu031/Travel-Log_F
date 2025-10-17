import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import api from '@/services/api';
import { toast } from 'sonner';

interface FlaggedPost {
  id: string;
  postId: string;
  reason: string;
  reportedBy: string;
  createdAt: string;
}

export default function Admin() {
  const [flaggedPosts, setFlaggedPosts] = useState<FlaggedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFlaggedPosts();
  }, []);

  const fetchFlaggedPosts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/flagged-posts');
      setFlaggedPosts(data);
    } catch (error) {
      console.error('Failed to fetch flagged posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (id: string) => {
    setFlaggedPosts(prev => prev.filter(p => p.id !== id));
    toast.success('Post approved and flag removed');
  };

  const handleRemove = (id: string) => {
    setFlaggedPosts(prev => prev.filter(p => p.id !== id));
    toast.success('Post removed successfully');
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">Manage flagged content and user reports</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Flagged Posts</p>
                <p className="text-3xl font-bold">{flaggedPosts.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold">1,247</p>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Posts</p>
                <p className="text-3xl font-bold">5,834</p>
              </div>
              <Check className="h-8 w-8 text-accent" />
            </div>
          </Card>
        </div>

        {/* Flagged Posts */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Flagged Content</h2>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton h-32 rounded-lg" />
              ))}
            </div>
          ) : flaggedPosts.length > 0 ? (
            flaggedPosts.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">Flagged</Badge>
                        <span className="text-sm text-muted-foreground">
                          Post ID: {item.postId}
                        </span>
                      </div>
                      <p className="font-semibold">Reason: {item.reason}</p>
                      <p className="text-sm text-muted-foreground">
                        Reported by: {item.reportedBy} •{' '}
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApprove(item.id)}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemove(item.id)}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <Card className="p-12 text-center">
              <Check className="h-16 w-16 mx-auto text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-2">All Clear!</h3>
              <p className="text-muted-foreground">No flagged content to review</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

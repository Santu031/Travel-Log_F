import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, UserCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isFollowing?: boolean;
}

export default function SearchFriends() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  // Fetch users when search changes
  useEffect(() => {
    const fetchUsers = async () => {
      if (search.trim() === '') {
        setUsers([]);
        return;
      }

      setLoading(true);
      try {
        const response = await api.get('/gallery/users', {
          params: { search }
        });
        
        // Filter out current user from results
        const filteredUsers = response.data.filter((user: User) => user.id !== currentUser?.id);
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce the search to avoid too many API calls
    const debounceTimer = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [search, currentUser?.id]);

  const toggleFollow = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
    ));
  };

  const handleUserClick = (user: User) => {
    // Navigate to user profile page
    navigate(`/account/profile/${user.email}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search friends..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground">Suggested for you</h3>
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : users.length > 0 ? (
            users.map((user, index) => (
              <motion.div 
                key={user.id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="flex items-center justify-between group"
              >
                {/* Make the user info clickable to navigate to profile */}
                <div 
                  className="flex items-center gap-3 cursor-pointer flex-1"
                  onClick={() => handleUserClick(user)}
                >
                  <Avatar className="h-10 w-10 ring-2 ring-transparent group-hover:ring-primary transition-all">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm group-hover:text-primary transition-colors">{user.name}</p>
                    <p className="text-xs text-muted-foreground">Suggested for you</p>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="sm"
                    variant={user.isFollowing ? 'outline' : 'default'}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent navigation when clicking follow button
                      toggleFollow(user.id);
                    }}
                    className="transition-all duration-300"
                  >
                    {user.isFollowing ? (
                      <>
                        <UserCheck className="h-4 w-4 mr-1" />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-1" />
                        Follow
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            ))
          ) : search.trim() !== '' ? (
            <p className="text-center text-muted-foreground py-4">No users found</p>
          ) : (
            <p className="text-center text-muted-foreground py-4">Search for users by name</p>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
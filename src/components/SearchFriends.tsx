import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, UserCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

interface User {
  id: string;
  displayName: string;
  avatar: string;
  isFollowing: boolean;
}

const mockUsers: User[] = [
  { id: '1', displayName: 'Sarah Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', isFollowing: false },
  { id: '2', displayName: 'Mike Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', isFollowing: true },
  { id: '3', displayName: 'Emma Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', isFollowing: false },
  { id: '4', displayName: 'John Davis', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', isFollowing: false },
];

export default function SearchFriends() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState(mockUsers);

  const filteredUsers = users.filter(user =>
    user.displayName.toLowerCase().includes(search.toLowerCase())
  );

  const toggleFollow = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
    ));
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
          {filteredUsers.map((user, index) => (
            <motion.div 
              key={user.id} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-transparent group-hover:ring-primary transition-all">
                  <AvatarImage src={user.avatar} alt={user.displayName} />
                  <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm group-hover:text-primary transition-colors">{user.displayName}</p>
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
                  onClick={() => toggleFollow(user.id)}
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
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

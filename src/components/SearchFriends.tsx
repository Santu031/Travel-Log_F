import { useState } from 'react';
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
        {filteredUsers.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} alt={user.displayName} />
                <AvatarFallback>{user.displayName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{user.displayName}</p>
                <p className="text-xs text-muted-foreground">Suggested for you</p>
              </div>
            </div>
            <Button
              size="sm"
              variant={user.isFollowing ? 'outline' : 'default'}
              onClick={() => toggleFollow(user.id)}
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
          </div>
        ))}
      </div>
    </Card>
  );
}

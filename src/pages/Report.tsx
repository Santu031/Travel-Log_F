import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import {
  MapPin,
  Calendar,
  TrendingUp,
  Plane,
  Hotel,
  ShoppingBag,
  Utensils,
  Plus,
  IndianRupee,
} from 'lucide-react';

// Updated interface to match backend TravelLog model
interface Expense {
  category: string;
  amount: number;
  description: string;
}

interface TravelLog {
  _id: string;
  userId: string;
  title: string;
  location: string;
  description: string;
  date: string;
  rating: number;
  imageUrl: string;
  expenses: Expense[];
  totalExpense: number;
  createdAt: string;
  updatedAt: string;
}

// Form validation schema
const tripFormSchema = z.object({
  title: z.string()
    .trim()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title must be less than 100 characters" }),
  location: z.string()
    .trim()
    .min(1, { message: "Location is required" })
    .max(100, { message: "Location must be less than 100 characters" }),
  description: z.string()
    .trim()
    .min(1, { message: "Description is required" })
    .max(1000, { message: "Description must be less than 1000 characters" }),
  date: z.string().min(1, { message: "Date is required" }),
  rating: z.coerce.number()
    .min(1, { message: "Rating must be at least 1" })
    .max(5, { message: "Rating must be at most 5" }),
  imageUrl: z.string()
    .trim()
    .url({ message: "Must be a valid URL" })
    .max(500, { message: "URL must be less than 500 characters" })
    .optional()
    .or(z.literal('')),
  flights: z.coerce.number()
    .nonnegative({ message: "Must be a positive number" })
    .min(0, { message: "Must be at least 0" }),
  accommodation: z.coerce.number()
    .nonnegative({ message: "Must be a positive number" })
    .min(0, { message: "Must be at least 0" }),
  food: z.coerce.number()
    .nonnegative({ message: "Must be a positive number" })
    .min(0, { message: "Must be at least 0" }),
  activities: z.coerce.number()
    .nonnegative({ message: "Must be a positive number" })
    .min(0, { message: "Must be at least 0" }),
});

type TripFormValues = z.infer<typeof tripFormSchema>;

const Reports = () => {
  const [travelLogs, setTravelLogs] = useState<TravelLog[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripFormSchema),
    defaultValues: {
      title: '',
      location: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      rating: 5,
      imageUrl: '',
      flights: 0,
      accommodation: 0,
      food: 0,
      activities: 0,
    },
  });

  // Fetch travel logs from the database
  useEffect(() => {
    fetchTravelLogs();
  }, []);

  const fetchTravelLogs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/travel');
      // Filter logs for current user if user exists
      const userLogs = user 
        ? response.data.filter((log: TravelLog) => log.userId === user.id)
        : response.data;
      setTravelLogs(userLogs);
    } catch (error) {
      console.error('Error fetching travel logs:', error);
      toast({
        title: "Error",
        description: "Failed to load travel history. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: TripFormValues) => {
    try {
      // Prepare expense data to match backend model
      const expenses: Expense[] = [
        { category: 'Flights', amount: data.flights, description: '' },
        { category: 'Accommodation', amount: data.accommodation, description: '' },
        { category: 'Food', amount: data.food, description: '' },
        { category: 'Activities', amount: data.activities, description: '' },
      ];

      // Calculate total expense
      const totalExpense = data.flights + data.accommodation + data.food + data.activities;

      // Prepare data for API call
      const tripData = {
        userId: user?.id,
        title: data.title,
        location: data.location,
        description: data.description,
        date: new Date(data.date).toISOString(),
        rating: data.rating,
        imageUrl: data.imageUrl || '',
        expenses,
        totalExpense,
      };

      // Send data to backend
      await api.post('/travel', tripData);

      // Refresh travel logs
      await fetchTravelLogs();

      // Close dialog and reset form
      setOpen(false);
      form.reset({
        title: '',
        location: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        rating: 5,
        imageUrl: '',
        flights: 0,
        accommodation: 0,
        food: 0,
        activities: 0,
      });

      toast({
        title: "Success!",
        description: "Trip has been added to your travel history.",
      });
    } catch (error) {
      console.error('Error adding trip:', error);
      toast({
        title: "Error",
        description: "Failed to add trip. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Calculate totals from actual travel logs
  const totalExpenses = travelLogs.reduce((sum, log) => sum + (log.totalExpense || 0), 0);

  // Calculate category totals from expenses
  const categoryTotals = travelLogs.reduce(
    (totals, log) => {
      log.expenses.forEach(expense => {
        const category = expense.category.toLowerCase();
        if (category.includes('flight')) {
          totals.flights += expense.amount;
        } else if (category.includes('accommodation') || category.includes('hotel')) {
          totals.accommodation += expense.amount;
        } else if (category.includes('food')) {
          totals.food += expense.amount;
        } else {
          totals.activities += expense.amount;
        }
      });
      return totals;
    },
    { flights: 0, accommodation: 0, food: 0, activities: 0 }
  );

  const expenseCategories = [
    { name: 'Flights', amount: categoryTotals.flights, icon: Plane, color: 'text-primary' },
    { name: 'Hotels', amount: categoryTotals.accommodation, icon: Hotel, color: 'text-secondary' },
    { name: 'Food', amount: categoryTotals.food, icon: Utensils, color: 'text-accent' },
    {
      name: 'Activities',
      amount: categoryTotals.activities,
      icon: ShoppingBag,
      color: 'text-muted-foreground',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
        <div className="container mx-auto px-4 py-12 space-y-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gradient-primary mb-4">Travel Reports</h1>
            <p className="text-xl text-muted-foreground">Loading your travel history...</p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container mx-auto px-4 py-12 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-3 p-3 rounded-2xl bg-gradient-hero mb-4">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gradient-primary">Travel Reports</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your complete travel history and expense tracking
          </p>
          
          {/* Add Trip Button */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="btn-hero mt-4">
                <Plus className="w-5 h-5 mr-2" />
                Add New Trip
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl text-gradient-primary">Add New Trip</DialogTitle>
                <DialogDescription>
                  Record your travel memories and expenses
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {/* Trip Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title *</FormLabel>
                          <FormControl>
                            <Input placeholder="Amazing trip to Tokyo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location *</FormLabel>
                          <FormControl>
                            <Input placeholder="Tokyo, Japan" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about your amazing trip experience..." 
                            className="resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Date and Rating */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rating (1-5) *</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" max="5" step="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Expenses */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <IndianRupee className="w-4 h-4" />
                      Expenses (in ₹)
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="flights"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Plane className="w-4 h-4 text-primary" />
                              Flights (₹) *
                            </FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="1200" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="accommodation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Hotel className="w-4 h-4 text-secondary" />
                              Accommodation (₹) *
                            </FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="800" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="food"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Utensils className="w-4 h-4 text-accent" />
                              Food (₹) *
                            </FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="450" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="activities"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                              Activities (₹) *
                            </FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="350" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Image URL */}
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL (optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://images.unsplash.com/photo-..." 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setOpen(false);
                        form.reset();
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1 btn-hero">
                      Add Trip
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </motion.div>

        {travelLogs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
          </motion.div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="glass border-white/20 shadow-xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Trips
                    </CardTitle>
                    <MapPin className="w-4 h-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gradient-primary">{travelLogs.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">Countries visited</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="glass border-white/20 shadow-xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Expenses
                    </CardTitle>
                    <IndianRupee className="w-4 h-4 text-secondary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gradient-sunset">
                      ₹{totalExpenses.toLocaleString('en-IN')}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Across all trips</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="glass border-white/20 shadow-xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Avg Per Trip
                    </CardTitle>
                    <TrendingUp className="w-4 h-4 text-accent" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold" style={{ color: 'hsl(var(--accent))' }}>
                      ₹{travelLogs.length > 0 ? Math.round(totalExpenses / travelLogs.length).toLocaleString('en-IN') : 0}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Average spending</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="glass border-white/20 shadow-xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Days
                    </CardTitle>
                    <Calendar className="w-4 h-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">
                      {travelLogs.reduce((sum, log) => {
                        // For simplicity, we'll assume each trip is 5 days
                        // In a real app, you'd have start/end dates
                        return sum + 5;
                      }, 0)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Days traveling</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Expense Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="glass border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-gradient-primary">Expense Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {expenseCategories.map((category, index) => {
                    const Icon = category.icon;
                    const percentage = totalExpenses > 0 ? (category.amount / totalExpenses) * 100 : 0;
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <Icon className={`w-5 h-5 ${category.color}`} />
                            </div>
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">
                              ₹{category.amount.toLocaleString('en-IN')}
                            </div>
                            <div className="text-sm text-muted-foreground">{percentage.toFixed(1)}%</div>
                          </div>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>

            {/* Travel History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gradient-primary">Travel History</h2>
                <Button 
                  onClick={() => setOpen(true)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Trip
                </Button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {travelLogs.map((log, index) => {
                  return (
                    <motion.div
                      key={log._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="group"
                    >
                      <Card className="glass border-white/20 shadow-xl overflow-hidden">
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={log.imageUrl || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800"}
                            alt={log.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-2xl font-bold text-white">{log.title}</h3>
                            <div className="flex items-center gap-2 text-white/90 text-sm mt-1">
                              <MapPin className="w-4 h-4" />
                              <span>{log.location}</span>
                            </div>
                          </div>
                          <Badge className="absolute top-4 right-4 bg-gradient-hero text-white border-0">
                            ₹{log.totalExpense?.toLocaleString('en-IN') || 0}
                          </Badge>
                        </div>
                        <CardContent className="p-6 space-y-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(log.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {log.expenses.slice(0, 4).map((expense, expIndex) => {
                              let Icon = ShoppingBag;
                              let iconColor = "text-muted-foreground";
                              
                              if (expense.category.toLowerCase().includes('flight')) {
                                Icon = Plane;
                                iconColor = "text-primary";
                              } else if (expense.category.toLowerCase().includes('accommodation') || 
                                         expense.category.toLowerCase().includes('hotel')) {
                                Icon = Hotel;
                                iconColor = "text-secondary";
                              } else if (expense.category.toLowerCase().includes('food')) {
                                Icon = Utensils;
                                iconColor = "text-accent";
                              }
                              
                              return (
                                <div key={expIndex} className="flex items-center gap-2 p-3 rounded-lg bg-primary/5">
                                  <Icon className={`w-4 h-4 ${iconColor}`} />
                                  <div>
                                    <div className="text-xs text-muted-foreground">{expense.category}</div>
                                    <div className="font-semibold">₹{expense.amount.toLocaleString('en-IN')}</div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default Reports;
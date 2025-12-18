import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Plus, X, Home, Package, MessageSquare, UtensilsCrossed, Trash2, DoorClosed } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MenuItem {
  id: string;
  name: string;
  available: boolean;
  on_daily_menu: boolean;
  display_order: number;
}

interface FeedbackRequest {
  id: string;
  name: string | null;
  message: string;
  created_at: string;
  is_read: boolean;
}

const Admin = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [feedbackRequests, setFeedbackRequests] = useState<FeedbackRequest[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { user, canEditMenu, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/admin/login');
      } else if (!canEditMenu) {
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to edit the menu.',
          variant: 'destructive',
        });
        navigate('/');
      }
    }
  }, [user, canEditMenu, loading, navigate, toast]);

  useEffect(() => {
    if (user && canEditMenu) {
      fetchMenuItems();
      fetchFeedbackRequests();
    }
  }, [user, canEditMenu]);

  const fetchMenuItems = async () => {
    const { data, error } = await supabase
      .from('daily_menu_items')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching menu items:', error);
      toast({
        title: 'Error',
        description: 'Failed to load menu items.',
        variant: 'destructive',
      });
    } else {
      setMenuItems(data || []);
    }
    setIsLoading(false);
  };

  const fetchFeedbackRequests = async () => {
    const { data, error } = await supabase
      .from('feedback_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching feedback:', error);
    } else {
      setFeedbackRequests(data || []);
    }
  };

  const toggleOnDailyMenu = async (id: string, currentValue: boolean) => {
    const { error } = await supabase
      .from('daily_menu_items')
      .update({ on_daily_menu: !currentValue, available: !currentValue ? true : false })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update item.',
        variant: 'destructive',
      });
    } else {
      setMenuItems(items =>
        items.map(item =>
          item.id === id ? { ...item, on_daily_menu: !currentValue, available: !currentValue ? true : false } : item
        )
      );
    }
  };

  const toggleAvailability = async (id: string, currentValue: boolean) => {
    const { error } = await supabase
      .from('daily_menu_items')
      .update({ available: !currentValue })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update stock status.',
        variant: 'destructive',
      });
    } else {
      setMenuItems(items =>
        items.map(item =>
          item.id === id ? { ...item, available: !currentValue } : item
        )
      );
    }
  };

  const addMenuItem = async () => {
    if (!newItemName.trim()) return;

    setIsSaving(true);
    const maxOrder = Math.max(...menuItems.map(i => i.display_order), 0);

    const { data, error } = await supabase
      .from('daily_menu_items')
      .insert({ name: newItemName.trim(), available: false, on_daily_menu: false, display_order: maxOrder + 1 })
      .select()
      .single();

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item.',
        variant: 'destructive',
      });
    } else if (data) {
      setMenuItems([...menuItems, data]);
      setNewItemName('');
      toast({
        title: 'Item Added',
        description: `${data.name} has been added to the master list.`,
      });
    }
    setIsSaving(false);
  };

  const removeFromDailyMenu = async (id: string, name: string) => {
    const { error } = await supabase
      .from('daily_menu_items')
      .update({ on_daily_menu: false, available: false })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove item from daily menu.',
        variant: 'destructive',
      });
    } else {
      setMenuItems(items =>
        items.map(item =>
          item.id === id ? { ...item, on_daily_menu: false, available: false } : item
        )
      );
      toast({
        title: 'Removed from Daily Menu',
        description: `${name} has been removed from today's menu.`,
      });
    }
  };

  const markAsClosed = async () => {
    const dailyItems = menuItems.filter(item => item.on_daily_menu);
    if (dailyItems.length === 0) return;

    const { error } = await supabase
      .from('daily_menu_items')
      .update({ on_daily_menu: false, available: false })
      .in('id', dailyItems.map(item => item.id));

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to close the menu.',
        variant: 'destructive',
      });
    } else {
      setMenuItems(items =>
        items.map(item => ({ ...item, on_daily_menu: false, available: false }))
      );
      toast({
        title: 'Closed',
        description: 'All items removed from today\'s menu. Customers will see "We are closed".',
      });
    }
  };

  const markFeedbackAsRead = async (id: string, currentValue: boolean) => {
    const { error } = await supabase
      .from('feedback_requests')
      .update({ is_read: !currentValue })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update feedback.',
        variant: 'destructive',
      });
    } else {
      setFeedbackRequests(items =>
        items.map(item =>
          item.id === id ? { ...item, is_read: !currentValue } : item
        )
      );
    }
  };

  const deleteFeedback = async (id: string) => {
    const { error } = await supabase
      .from('feedback_requests')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete feedback.',
        variant: 'destructive',
      });
    } else {
      setFeedbackRequests(items => items.filter(item => item.id !== id));
      toast({
        title: 'Deleted',
        description: 'Feedback has been deleted.',
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user || !canEditMenu) {
    return null;
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const dailyMenuItems = menuItems.filter(item => item.on_daily_menu);
  const availableToAdd = menuItems.filter(item => !item.on_daily_menu);
  const unreadCount = feedbackRequests.filter(f => !f.is_read).length;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-4 px-6">
        <div className="container max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            <p className="text-primary-foreground/70 text-sm">{today}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <Home className="w-4 h-4 mr-1" />
              View Site
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-1" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto py-8 px-6">
        <Tabs defaultValue="menu" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="menu" className="flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4" />
              Daily Menu
            </TabsTrigger>
            <TabsTrigger value="feedback" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Feedback
              {unreadCount > 0 && (
                <span className="bg-destructive text-destructive-foreground text-xs rounded-full px-2 py-0.5">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="menu" className="space-y-6">
            {/* Today's Daily Menu */}
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-primary">Today's Daily Menu</h2>
                {dailyMenuItems.length > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={markAsClosed}
                    className="gap-2"
                  >
                    <DoorClosed className="w-4 h-4" />
                    We Are Closed
                  </Button>
                )}
              </div>
              <p className="text-muted-foreground text-sm mb-6">
                These items are shown on today's menu. Toggle stock status or remove items.
              </p>

              {dailyMenuItems.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No items on today's menu. Add items from the list below.
                </p>
              ) : (
                <div className="space-y-3">
                  {dailyMenuItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-muted/30 rounded-lg p-4 border border-border"
                    >
                      <span className="font-medium text-foreground">{item.name}</span>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-muted-foreground" />
                          <span className={`text-sm ${item.available ? 'text-green-600' : 'text-destructive'}`}>
                            {item.available ? 'In Stock' : 'Out of Stock'}
                          </span>
                          <Switch
                            checked={item.available}
                            onCheckedChange={() => toggleAvailability(item.id, item.available)}
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromDailyMenu(item.id, item.name)}
                          className="text-destructive hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Master List - Add to Daily Menu */}
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
              <h2 className="text-lg font-semibold text-primary mb-2">All Menu Items</h2>
              <p className="text-muted-foreground text-sm mb-6">
                Click an item to add it to today's daily menu.
              </p>

              {availableToAdd.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  All items are on today's menu!
                </p>
              ) : (
                <div className="flex flex-wrap gap-2 mb-6">
                  {availableToAdd.map((item) => (
                    <Button
                      key={item.id}
                      variant="outline"
                      size="sm"
                      onClick={() => toggleOnDailyMenu(item.id, item.on_daily_menu)}
                      className="flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      {item.name}
                    </Button>
                  ))}
                </div>
              )}

              <div className="border-t border-border pt-6">
                <h3 className="text-sm font-medium text-foreground mb-3">Add New Item to Master List</h3>
                <div className="flex gap-3">
                  <Input
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Enter item name..."
                    onKeyDown={(e) => e.key === 'Enter' && addMenuItem()}
                  />
                  <Button onClick={addMenuItem} disabled={isSaving || !newItemName.trim()}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
              <h2 className="text-lg font-semibold text-primary mb-2">Feedback & Requests</h2>
              <p className="text-muted-foreground text-sm mb-6">
                View and manage feedback submitted by customers.
              </p>

              {feedbackRequests.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No feedback received yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {feedbackRequests.map((feedback) => (
                    <div
                      key={feedback.id}
                      className={`rounded-lg p-4 border ${
                        feedback.is_read 
                          ? 'bg-muted/20 border-border' 
                          : 'bg-accent/10 border-accent/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-foreground">
                              {feedback.name || 'Anonymous'}
                            </span>
                            {!feedback.is_read && (
                              <span className="bg-accent text-accent-foreground text-xs rounded px-2 py-0.5">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {new Date(feedback.created_at).toLocaleString()}
                          </p>
                          <p className="text-foreground whitespace-pre-wrap">{feedback.message}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markFeedbackAsRead(feedback.id, feedback.is_read)}
                          >
                            {feedback.is_read ? 'Mark Unread' : 'Mark Read'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteFeedback(feedback.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;

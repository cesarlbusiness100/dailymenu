import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Plus, X, Home, Check, Package } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  available: boolean;
  on_daily_menu: boolean;
  display_order: number;
}

const Admin = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
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

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-4 px-6">
        <div className="container max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Daily Menu Manager</h1>
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

      <main className="container max-w-4xl mx-auto py-8 px-6 space-y-6">
        {/* Today's Daily Menu */}
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <h2 className="text-lg font-semibold text-primary mb-2">Today's Daily Menu</h2>
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
      </main>
    </div>
  );
};

export default Admin;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Plus, Trash2, GripVertical, Save, Home } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  available: boolean;
  display_order: number;
}

const Admin = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/admin/login');
      } else if (!isAdmin) {
        toast({
          title: 'Access Denied',
          description: 'You do not have admin privileges.',
          variant: 'destructive',
        });
        navigate('/');
      }
    }
  }, [user, isAdmin, loading, navigate, toast]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchMenuItems();
    }
  }, [user, isAdmin]);

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

  const toggleAvailability = async (id: string, currentValue: boolean) => {
    const { error } = await supabase
      .from('daily_menu_items')
      .update({ available: !currentValue })
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
      .insert({ name: newItemName.trim(), available: true, display_order: maxOrder + 1 })
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
        description: `${data.name} has been added to the menu.`,
      });
    }
    setIsSaving(false);
  };

  const deleteMenuItem = async (id: string, name: string) => {
    const { error } = await supabase
      .from('daily_menu_items')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete item.',
        variant: 'destructive',
      });
    } else {
      setMenuItems(items => items.filter(item => item.id !== id));
      toast({
        title: 'Item Deleted',
        description: `${name} has been removed.`,
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

  if (!user || !isAdmin) {
    return null;
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

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

      <main className="container max-w-4xl mx-auto py-8 px-6">
        <div className="bg-card rounded-xl p-6 shadow-sm border border-border mb-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Today's Available Items</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Toggle items on or off to update what students see on the menu.
          </p>

          <div className="space-y-3">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-muted/30 rounded-lg p-4 border border-border"
              >
                <div className="flex items-center gap-3">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">{item.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${item.available ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {item.available ? 'Available' : 'Unavailable'}
                    </span>
                    <Switch
                      checked={item.available}
                      onCheckedChange={() => toggleAvailability(item.id, item.available)}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMenuItem(item.id, item.name)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
          <h2 className="text-lg font-semibold text-primary mb-4">Add New Item</h2>
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
      </main>
    </div>
  );
};

export default Admin;

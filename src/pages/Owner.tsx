import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Clock, Users, ChefHat, CheckCircle, AlertTriangle, Timer } from 'lucide-react';

interface CustomerOrder {
  id: string;
  customer_name: string;
  table_number: number;
  items: any;
  message?: string;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface OrderItem {
  id: string;
  name: string;
  size?: string;
  price: number;
  quantity: number;
  temperature?: string;
}

export default function Owner() {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('customer_orders_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'customer_orders'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('customer_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
      return;
    }

    setOrders(data || []);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setLoading(true);

    const { error } = await supabase
      .from('customer_orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Order status updated to ${newStatus}`,
      });
      fetchOrders();
    }

    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inprogress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'slow': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'delay': return 'bg-red-100 text-red-800 border-red-200';
      case 'complete': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'inprogress': return <ChefHat className="h-4 w-4" />;
      case 'slow': return <Timer className="h-4 w-4" />;
      case 'delay': return <AlertTriangle className="h-4 w-4" />;
      case 'complete': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const parseOrderItems = (itemsJson: any): OrderItem[] => {
    try {
      if (typeof itemsJson === 'string') {
        return JSON.parse(itemsJson);
      } else if (Array.isArray(itemsJson)) {
        return itemsJson;
      }
      return [];
    } catch {
      return [];
    }
  };

  const groupOrdersByTable = (orders: CustomerOrder[]) => {
    const grouped: { [key: number]: CustomerOrder[] } = {};
    orders.forEach(order => {
      if (!grouped[order.table_number]) {
        grouped[order.table_number] = [];
      }
      grouped[order.table_number].push(order);
    });
    return grouped;
  };

  const filterOrdersByStatus = (status: string) => {
    return orders.filter(order => order.status === status);
  };

  const OrderCard = ({ order }: { order: CustomerOrder }) => {
    const items = parseOrderItems(order.items);
    const timeAgo = new Date(order.created_at).toLocaleTimeString();

    return (
      <Card className="mb-4 hover:bg-accent/50 transition-colors">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                {order.customer_name}
              </CardTitle>
              <CardDescription>
                Table {order.table_number} • {timeAgo}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className={getStatusColor(order.status)}>
                {getStatusIcon(order.status)}
                {order.status}
              </Badge>
              <Badge variant="outline">₹{order.total_amount}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-sm">
              <strong>Items ({items.length}):</strong>
              <div className="mt-1 space-y-1">
                {items.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="text-xs text-muted-foreground flex justify-between">
                    <span>
                      {item.name}
                      {item.size && ` (${item.size})`}
                      {item.temperature && ` - ${item.temperature}`}
                    </span>
                    <span>{item.quantity}x</span>
                  </div>
                ))}
                {items.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{items.length - 3} more items...
                  </div>
                )}
              </div>
            </div>
            {order.message && (
              <div className="text-sm">
                <strong>Note:</strong> <span className="text-muted-foreground">{order.message}</span>
              </div>
            )}
            <Separator />
            <div className="flex gap-2 flex-wrap">
              {['pending', 'inprogress', 'slow', 'delay', 'complete'].map(status => (
                <Button
                  key={status}
                  size="sm"
                  variant={order.status === status ? "default" : "outline"}
                  onClick={() => updateOrderStatus(order.id, status)}
                  disabled={loading || order.status === status}
                  className="text-xs"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const OrderDetailsDialog = ({ order }: { order: CustomerOrder }) => {
    const items = parseOrderItems(order.items);
    
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">View Details</Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Order Details - {order.customer_name}</DialogTitle>
            <DialogDescription>
              Table {order.table_number} • {new Date(order.created_at).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Items Ordered:</h4>
              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.size && `Size: ${item.size}`}
                        {item.temperature && ` • Temperature: ${item.temperature}`}
                      </div>
                    </div>
                    <div className="text-right">
                      <div>Qty: {item.quantity}</div>
                      <div className="text-sm">₹{item.price * item.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {order.message && (
              <div>
                <h4 className="font-medium mb-2">Special Instructions:</h4>
                <p className="text-sm text-muted-foreground border p-2 rounded">
                  {order.message}
                </p>
              </div>
            )}
            <div className="flex justify-between items-center text-lg font-semibold border-t pt-2">
              <span>Total Amount:</span>
              <span>₹{order.total_amount}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const groupedOrders = groupOrdersByTable(orders);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Restaurant Management</h1>
        <p className="text-muted-foreground">
          Real-time order management system • {orders.length} total orders
        </p>
      </div>

      <Tabs defaultValue="by-status" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="by-status">By Status</TabsTrigger>
          <TabsTrigger value="by-table">By Table</TabsTrigger>
        </TabsList>

        <TabsContent value="by-status" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-600">
                  <Clock className="h-5 w-5" />
                  Pending Orders ({filterOrdersByStatus('pending').length})
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto">
                {filterOrdersByStatus('pending').map(order => (
                  <div key={order.id} className="mb-4 last:mb-0">
                    <OrderCard order={order} />
                  </div>
                ))}
                {filterOrdersByStatus('pending').length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No pending orders</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <ChefHat className="h-5 w-5" />
                  In Progress ({filterOrdersByStatus('inprogress').length + filterOrdersByStatus('slow').length + filterOrdersByStatus('delay').length})
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto">
                {[...filterOrdersByStatus('inprogress'), ...filterOrdersByStatus('slow'), ...filterOrdersByStatus('delay')].map(order => (
                  <div key={order.id} className="mb-4 last:mb-0">
                    <OrderCard order={order} />
                  </div>
                ))}
                {filterOrdersByStatus('inprogress').length + filterOrdersByStatus('slow').length + filterOrdersByStatus('delay').length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No orders in progress</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  Completed ({filterOrdersByStatus('complete').length})
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto">
                {filterOrdersByStatus('complete').map(order => (
                  <div key={order.id} className="mb-4 last:mb-0">
                    <OrderCard order={order} />
                  </div>
                ))}
                {filterOrdersByStatus('complete').length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No completed orders</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="by-table" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(groupedOrders)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([tableNumber, tableOrders]) => (
                <Card key={tableNumber}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Table {tableNumber} ({tableOrders.length} orders)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-80 overflow-y-auto">
                    {tableOrders.map(order => (
                      <div key={order.id} className="mb-3 last:mb-0">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{order.customer_name}</span>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center text-sm text-muted-foreground">
                          <span>₹{order.total_amount}</span>
                          <OrderDetailsDialog order={order} />
                        </div>
                        <Separator className="my-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
          </div>
          {Object.keys(groupedOrders).length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No orders found</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
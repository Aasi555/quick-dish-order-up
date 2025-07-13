import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Minus, Plus, ShoppingCart } from 'lucide-react';

interface MenuItem {
  id: string;
  category: string;
  name: string;
  size: string | null;
  price: number;
  temperature: string | null;
}

interface OrderItem extends MenuItem {
  quantity: number;
}

export default function Customer() {
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('category')
      .order('name');

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch menu items",
        variant: "destructive",
      });
      return;
    }

    setMenuItems(data || []);
  };

  const addToOrder = (item: MenuItem) => {
    const existingItem = orderItems.find(
      orderItem => 
        orderItem.id === item.id && 
        orderItem.temperature === item.temperature
    );

    if (existingItem) {
      setOrderItems(orderItems.map(orderItem =>
        orderItem.id === item.id && orderItem.temperature === item.temperature
          ? { ...orderItem, quantity: orderItem.quantity + 1 }
          : orderItem
      ));
    } else {
      setOrderItems([...orderItems, { ...item, quantity: 1 }]);
    }
  };

  const removeFromOrder = (item: OrderItem) => {
    if (item.quantity === 1) {
      setOrderItems(orderItems.filter(orderItem => 
        !(orderItem.id === item.id && orderItem.temperature === item.temperature)
      ));
    } else {
      setOrderItems(orderItems.map(orderItem =>
        orderItem.id === item.id && orderItem.temperature === item.temperature
          ? { ...orderItem, quantity: orderItem.quantity - 1 }
          : orderItem
      ));
    }
  };

  const getTotalAmount = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const submitOrder = async () => {
    if (!customerName || !tableNumber || orderItems.length === 0) {
      toast({
        title: "Error",
        description: "Please fill all required fields and add items to your order",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const orderData = {
      customer_name: customerName,
      table_number: parseInt(tableNumber),
      items: JSON.stringify(orderItems),
      message: message || null,
      total_amount: getTotalAmount(),
      status: 'pending'
    };

    const { error } = await supabase
      .from('customer_orders')
      .insert([orderData]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit order",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Order submitted successfully!",
      });
      // Reset form
      setCustomerName('');
      setTableNumber('');
      setOrderItems([]);
      setMessage('');
    }

    setLoading(false);
  };

  const vegItems = menuItems.filter(item => item.category === 'veg');
  const nonVegItems = menuItems.filter(item => item.category === 'nonVeg');
  const waterItems = menuItems.filter(item => item.category === 'water');

  const renderMenuItem = (item: MenuItem) => {
    const orderItem = orderItems.find(
      orderItem => 
        orderItem.id === item.id && 
        orderItem.temperature === item.temperature
    );
    const quantity = orderItem?.quantity || 0;

    return (
      <Card key={`${item.id}-${item.temperature || 'none'}`} className="mb-2">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-sm">{item.name}</CardTitle>
              <CardDescription className="text-xs">
                {item.size && `Size: ${item.size}`}
                {item.temperature && ` • ${item.temperature}`}
              </CardDescription>
            </div>
            <Badge variant="secondary">₹{item.price}</Badge>
          </div>
        </CardHeader>
        <CardFooter className="pt-0 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => orderItem && removeFromOrder(orderItem)}
              disabled={quantity === 0}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center">{quantity}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => addToOrder(item)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Form */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customerName">Customer Name *</Label>
                <Input
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <Label htmlFor="tableNumber">Table Number *</Label>
                <Select value={tableNumber} onValueChange={setTableNumber}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select table number" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        Table {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Menu */}
          <Card>
            <CardHeader>
              <CardTitle>Menu</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" defaultValue={["veg", "nonveg", "water"]}>
                <AccordionItem value="veg">
                  <AccordionTrigger className="text-green-600">
                    🥬 Veg Menu ({vegItems.length} items)
                  </AccordionTrigger>
                  <AccordionContent>
                    {vegItems.map(renderMenuItem)}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="nonveg">
                  <AccordionTrigger className="text-red-600">
                    🍗 Non-Veg Menu ({nonVegItems.length} items)
                  </AccordionTrigger>
                  <AccordionContent>
                    {nonVegItems.map(renderMenuItem)}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="water">
                  <AccordionTrigger className="text-blue-600">
                    💧 Water Bottles ({waterItems.length} options)
                  </AccordionTrigger>
                  <AccordionContent>
                    {waterItems.map(renderMenuItem)}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Additional Message */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Additional Message</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Any special instructions or requests..."
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orderItems.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No items added yet
                </p>
              ) : (
                <div className="space-y-2">
                  {orderItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <div className="flex-1">
                        <div>{item.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.size && `${item.size}`}
                          {item.temperature && ` • ${item.temperature}`}
                        </div>
                      </div>
                      <div className="text-right">
                        <div>{item.quantity} × ₹{item.price}</div>
                        <div className="text-xs">₹{item.quantity * item.price}</div>
                      </div>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>₹{getTotalAmount()}</span>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={submitOrder}
                disabled={loading || orderItems.length === 0}
              >
                {loading ? 'Submitting...' : 'Submit Order'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
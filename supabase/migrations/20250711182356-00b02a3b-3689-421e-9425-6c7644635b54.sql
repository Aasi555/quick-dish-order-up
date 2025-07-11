-- Create menu_items table
CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('veg', 'nonVeg', 'water')),
  name TEXT NOT NULL,
  size TEXT,
  price INTEGER NOT NULL,
  temperature TEXT CHECK (temperature IN ('cold', 'normal') OR temperature IS NULL),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create customer_orders table
CREATE TABLE public.customer_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  table_number INTEGER NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  message TEXT,
  total_amount INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'inprogress', 'slow', 'delay', 'complete')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_orders ENABLE ROW LEVEL SECURITY;

-- Create policies for menu_items (publicly readable)
CREATE POLICY "Menu items are publicly viewable" 
ON public.menu_items 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can manage menu items" 
ON public.menu_items 
FOR ALL 
USING (true);

-- Create policies for customer_orders (publicly accessible for demo)
CREATE POLICY "Orders are publicly viewable" 
ON public.customer_orders 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create orders" 
ON public.customer_orders 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update orders" 
ON public.customer_orders 
FOR UPDATE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_customer_orders_updated_at
BEFORE UPDATE ON public.customer_orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample menu items
INSERT INTO public.menu_items (category, name, size, price) VALUES
-- Veg items
('veg', 'Paneer Butter Masala', 'Full', 280),
('veg', 'Paneer Butter Masala', 'Half', 180),
('veg', 'Dal Tadka', 'Full', 200),
('veg', 'Dal Tadka', 'Half', 120),
('veg', 'Veg Biryani', 'Full', 250),
('veg', 'Mix Veg', 'Full', 220),
('veg', 'Mix Veg', 'Half', 140),
('veg', 'Rajma', 'Full', 200),
('veg', 'Rajma', 'Half', 120),

-- Non-veg items
('nonVeg', 'Chicken Curry', 'Full', 350),
('nonVeg', 'Chicken Curry', 'Half', 220),
('nonVeg', 'Mutton Curry', 'Full', 450),
('nonVeg', 'Mutton Curry', 'Half', 280),
('nonVeg', 'Chicken Biryani', 'Full', 320),
('nonVeg', 'Fish Curry', 'Full', 300),
('nonVeg', 'Fish Curry', 'Half', 200),

-- Water bottles
('water', 'Water Bottle', 'Small', 10, 'cold'),
('water', 'Water Bottle', 'Small', 10, 'normal'),
('water', 'Water Bottle', 'Big', 20, 'cold'),
('water', 'Water Bottle', 'Big', 20, 'normal');

-- Enable realtime for customer_orders
ALTER TABLE public.customer_orders REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.customer_orders;
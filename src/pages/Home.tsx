import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ChefHat, ShoppingCart, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            🍽️ Hotel Order Management
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Streamline your restaurant operations with our real-time order management system.
            Perfect for hotels, restaurants, and cafes.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <ShoppingCart className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <CardTitle className="text-lg">Easy Ordering</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Customers can browse menu and place orders directly from their table
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Clock className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <CardTitle className="text-lg">Real-time Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Orders update in real-time across all devices for instant coordination
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <ChefHat className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <CardTitle className="text-lg">Kitchen Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Track order status from pending to complete with easy status updates
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-8 w-8 mx-auto text-red-600 mb-2" />
              <CardTitle className="text-lg">Table Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Organize orders by table and customer for better service
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Customer Portal */}
          <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                <Users className="h-12 w-12 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-blue-700">Customer Portal</CardTitle>
              <CardDescription className="text-base">
                Place your order directly from your table
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Browse categorized menu (Veg, Non-Veg, Beverages)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Select items with size and temperature options</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Add special instructions and submit order</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>View total amount before confirming</span>
                </div>
              </div>
              <Separator />
              <Link to="/customer" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg">
                  Start Ordering
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Owner Portal */}
          <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-green-200">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                <ChefHat className="h-12 w-12 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-700">Owner Portal</CardTitle>
              <CardDescription className="text-base">
                Manage all orders and kitchen operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Real-time order notifications and updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Organize orders by status (Pending, In Progress, Complete)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>View orders by table for better coordination</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Update order status with one click</span>
                </div>
              </div>
              <Separator />
              <Link to="/owner" className="block">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg">
                  Manage Orders
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Sample Menu Preview */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sample Menu Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Card className="border border-green-200 bg-green-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-green-700">🥬 Veg Menu</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Paneer Butter Masala</span>
                  <span>₹280</span>
                </div>
                <div className="flex justify-between">
                  <span>Dal Tadka</span>
                  <span>₹200</span>
                </div>
                <div className="flex justify-between">
                  <span>Veg Biryani</span>
                  <span>₹250</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-red-200 bg-red-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-red-700">🍗 Non-Veg Menu</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Chicken Curry</span>
                  <span>₹350</span>
                </div>
                <div className="flex justify-between">
                  <span>Mutton Curry</span>
                  <span>₹450</span>
                </div>
                <div className="flex justify-between">
                  <span>Chicken Biryani</span>
                  <span>₹320</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-blue-200 bg-blue-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-blue-700">💧 Beverages</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Water Bottle (Small)</span>
                  <span>₹10</span>
                </div>
                <div className="flex justify-between">
                  <span>Water Bottle (Big)</span>
                  <span>₹20</span>
                </div>
                <div className="text-xs text-gray-500 pt-2">
                  Cold or Normal temperature
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-500">
          <p className="text-sm">
            Built with React, Supabase & Real-time Database • Perfect for modern restaurants
          </p>
        </div>
      </div>
    </div>
  );
}
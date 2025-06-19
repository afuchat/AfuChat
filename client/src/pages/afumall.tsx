import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { DesktopSidebar, MobileNavigation, TopBar } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShoppingBag, 
  Search, 
  Star, 
  Heart,
  ShoppingCart,
  Filter,
  TrendingUp,
  Package,
  Wallet,
  Store
} from "lucide-react";

const categories = [
  { name: "Electronics", icon: "📱", count: 245 },
  { name: "Fashion", icon: "👕", count: 189 },
  { name: "Home & Garden", icon: "🏠", count: 156 },
  { name: "Sports", icon: "⚽", count: 98 },
  { name: "Books", icon: "📚", count: 167 },
  { name: "Beauty", icon: "💄", count: 134 },
];

const featuredProducts = [
  {
    id: 1,
    title: "Wireless Bluetooth Headphones",
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.5,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    seller: "TechStore",
    badge: "Hot Deal",
  },
  {
    id: 2,
    title: "Organic Cotton T-Shirt",
    price: 24.99,
    rating: 4.8,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
    seller: "EcoFashion",
    badge: "Eco-Friendly",
  },
  {
    id: 3,
    title: "Smart Home Security Camera",
    price: 159.99,
    originalPrice: 199.99,
    rating: 4.6,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
    seller: "SmartHome Pro",
    badge: "Trending",
  },
  {
    id: 4,
    title: "Yoga Mat Premium",
    price: 49.99,
    rating: 4.7,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1506629905607-47e4bb0b5c69?w=300&h=300&fit=crop",
    seller: "FitnessGear",
    badge: "New",
  },
];

const myListings = [
  {
    id: 1,
    title: "Vintage Camera Collection",
    price: 299.99,
    status: "Active",
    views: 45,
    likes: 12,
    image: "https://images.unsplash.com/photo-1495707902641-75ce1405f2c2?w=300&h=300&fit=crop",
  },
  {
    id: 2,
    title: "Designer Handbag",
    price: 189.99,
    status: "Sold",
    views: 89,
    likes: 23,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=300&fit=crop",
  },
];

export default function AfuMall() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const handleAddToCart = (productId: number) => {
    toast({
      title: "Added to Cart",
      description: "Product has been added to your cart!",
    });
  };

  const handleToggleLike = (productId: number) => {
    toast({
      title: "Added to Wishlist",
      description: "Product saved to your wishlist!",
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 bg-primary rounded-full animate-pulse mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <DesktopSidebar />
      
      <div className="flex-1 lg:ml-64">
        <TopBar title="AfuMall" />
        
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-6">
          <Tabs defaultValue="shop" className="h-full">
            <div className="border-b border-border px-4 lg:px-6">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="shop">Shop</TabsTrigger>
                <TabsTrigger value="sell">Sell</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="shop" className="p-4 lg:p-6 space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-muted border-0"
                />
                <Button className="absolute right-2 top-1/2 transform -translate-y-1/2" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>

              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Store className="w-5 h-5" />
                    <span>Categories</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {categories.map((category) => (
                      <Button
                        key={category.name}
                        variant={selectedCategory === category.name ? "default" : "outline"}
                        className="h-auto p-4 flex flex-col items-center space-y-2"
                        onClick={() => setSelectedCategory(category.name)}
                      >
                        <span className="text-2xl">{category.icon}</span>
                        <div className="text-center">
                          <p className="text-xs">{category.name}</p>
                          <p className="text-xs text-muted-foreground">({category.count})</p>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Featured Products */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Featured Products</span>
                  </h2>
                  <Button variant="outline" size="sm">View All</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <img 
                          src={product.image} 
                          alt={product.title}
                          className="w-full h-48 object-cover"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                          onClick={() => handleToggleLike(product.id)}
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                        {product.badge && (
                          <Badge className="absolute top-2 left-2">
                            {product.badge}
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-2 line-clamp-2">{product.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">by {product.seller}</p>
                        <div className="flex items-center space-x-1 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">({product.reviews})</span>
                        </div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-primary">${product.price}</span>
                            {product.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${product.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button 
                          className="w-full" 
                          size="sm"
                          onClick={() => handleAddToCart(product.id)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sell" className="p-4 lg:p-6 space-y-6">
              <div className="max-w-2xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Package className="w-5 h-5" />
                      <span>List a New Product</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Product Title</label>
                      <Input placeholder="Enter product title..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Price</label>
                        <Input type="number" placeholder="0.00" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Category</label>
                        <select className="w-full p-2 border border-input rounded-md bg-background">
                          {categories.map((cat) => (
                            <option key={cat.name} value={cat.name}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Description</label>
                      <textarea 
                        className="w-full p-3 border border-input rounded-md bg-background min-h-[100px]"
                        placeholder="Describe your product..."
                      ></textarea>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Product Images</label>
                      <div className="border-2 border-dashed border-input rounded-lg p-8 text-center">
                        <p className="text-muted-foreground">Drag & drop images here or click to browse</p>
                        <Button variant="outline" className="mt-2">Browse Files</Button>
                      </div>
                    </div>
                    <Button className="w-full">
                      <Package className="w-4 h-4 mr-2" />
                      List Product
                    </Button>
                  </CardContent>
                </Card>

                {/* My Listings */}
                <Card>
                  <CardHeader>
                    <CardTitle>My Listings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {myListings.map((listing) => (
                      <div key={listing.id} className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                        <img 
                          src={listing.image} 
                          alt={listing.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{listing.title}</h3>
                          <p className="text-sm text-muted-foreground">${listing.price}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <Badge variant={listing.status === 'Active' ? 'default' : 'secondary'}>
                              {listing.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{listing.views} views</span>
                            <span className="text-xs text-muted-foreground">{listing.likes} likes</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="orders" className="p-4 lg:p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <ShoppingBag className="w-8 h-8 text-primary mx-auto mb-2" />
                      <h3 className="font-semibold mb-1">Total Orders</h3>
                      <p className="text-2xl font-bold">24</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Package className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <h3 className="font-semibold mb-1">Delivered</h3>
                      <p className="text-2xl font-bold">18</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Wallet className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <h3 className="font-semibold mb-1">Total Spent</h3>
                      <p className="text-2xl font-bold">$1,247</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start shopping to see your order history here
                      </p>
                      <Button>
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Browse Products
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      
      <MobileNavigation />
    </div>
  );
}

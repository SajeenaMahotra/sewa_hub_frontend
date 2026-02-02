// app/admin/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Wrench,
  DollarSign, 
  Calendar,
  Plus,
  Star,
  Shield,
  FileText
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your platform activity</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Users
            </CardTitle>
            <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center">
              <Users className="h-5 w-5 text-[#EE7A40]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">0</div>
            <p className="text-xs text-gray-500 mt-1">Customers & providers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Services
            </CardTitle>
            <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center">
              <Wrench className="h-5 w-5 text-[#EE7A40]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">0</div>
            <p className="text-xs text-gray-500 mt-1">Listed services</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Bookings
            </CardTitle>
            <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-[#EE7A40]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">0</div>
            <p className="text-xs text-gray-500 mt-1">Service requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Revenue
            </CardTitle>
            <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-[#EE7A40]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">Rs. 0</div>
            <p className="text-xs text-gray-500 mt-1">Platform earnings</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button 
              variant="outline" 
              className="h-auto flex-col gap-3 p-6 hover:border-[#EE7A40] hover:bg-orange-50"
            >
              <Users className="h-8 w-8 text-[#EE7A40]" />
              <span className="font-medium">Users</span>
            </Button>

            <Button 
              variant="outline" 
              className="h-auto flex-col gap-3 p-6 hover:border-[#EE7A40] hover:bg-orange-50"
            >
              <Wrench className="h-8 w-8 text-[#EE7A40]" />
              <span className="font-medium">Services</span>
            </Button>

            <Button 
              variant="outline" 
              className="h-auto flex-col gap-3 p-6 hover:border-[#EE7A40] hover:bg-orange-50"
            >
              <Calendar className="h-8 w-8 text-[#EE7A40]" />
              <span className="font-medium">Bookings</span>
            </Button>

            <Button 
              variant="outline" 
              className="h-auto flex-col gap-3 p-6 hover:border-[#EE7A40] hover:bg-orange-50"
            >
              <DollarSign className="h-8 w-8 text-[#EE7A40]" />
              <span className="font-medium">Payments</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Platform Overview Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">No bookings yet</h3>
              <p className="text-sm text-gray-500 mb-4">
                Service requests will appear here
              </p>
              <Button className="bg-[#EE7A40] hover:bg-[#d66a35]">
                <Plus className="h-4 w-4 mr-2" />
                View All Bookings
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center">
                    <Star className="h-5 w-5 text-[#EE7A40]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Reviews</p>
                    <p className="text-xs text-gray-500">Customer feedback</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-gray-900">0</span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-[#EE7A40]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Reports</p>
                    <p className="text-xs text-gray-500">Complaints filed</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-gray-900">0</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-[#EE7A40]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Verified Providers</p>
                    <p className="text-xs text-gray-500">Trusted professionals</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-gray-900">0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
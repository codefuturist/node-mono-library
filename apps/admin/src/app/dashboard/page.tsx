import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/ui/stat-card";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function getDashboardStats() {
  const [totalUsers, totalProducts, totalOrders, ordersWithTotal] =
    await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
      }),
    ]);

  return {
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue: ordersWithTotal._sum.total || 0,
  };
}

async function getRecentOrders() {
  return prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
  });
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const recentOrders = await getRecentOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Overview of your admin panel</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          trend={{ value: 5.1, isPositive: true }}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-gray-600">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">
                      {order.user.name || order.user.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${order.total.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

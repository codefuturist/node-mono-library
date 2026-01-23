import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import * as dotenv from "dotenv";

dotenv.config();

// Create adapter with config object (Prisma 7.x)
const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || "file:./prisma/dev.db",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting seed...");

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      password: "admin123", // In production, use hashed passwords!
      role: "ADMIN",
    },
  });

  console.log("✅ Created admin user:", admin.email);

  // Create some regular users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "john@example.com" },
      update: {},
      create: {
        email: "john@example.com",
        name: "John Doe",
        password: "password123",
        role: "USER",
      },
    }),
    prisma.user.upsert({
      where: { email: "jane@example.com" },
      update: {},
      create: {
        email: "jane@example.com",
        name: "Jane Smith",
        password: "password123",
        role: "USER",
      },
    }),
  ]);

  console.log("✅ Created users:", users.length);

  // Create products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "Wireless Headphones",
        description: "High-quality wireless headphones with noise cancellation",
        price: 199.99,
        stock: 50,
        category: "Electronics",
        createdBy: admin.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Smart Watch",
        description: "Fitness tracker with heart rate monitor",
        price: 299.99,
        stock: 30,
        category: "Electronics",
        createdBy: admin.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Coffee Maker",
        description: "Programmable coffee maker with thermal carafe",
        price: 89.99,
        stock: 25,
        category: "Home",
        createdBy: admin.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Yoga Mat",
        description: "Non-slip yoga mat with carrying strap",
        price: 29.99,
        stock: 100,
        category: "Sports",
        createdBy: admin.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Running Shoes",
        description: "Lightweight running shoes for all terrain",
        price: 129.99,
        stock: 45,
        category: "Sports",
        createdBy: admin.id,
      },
    }),
  ]);

  console.log("✅ Created products:", products.length);

  // Create orders
  const order1 = await prisma.order.create({
    data: {
      userId: users[0].id,
      total: 229.98,
      status: "COMPLETED",
      items: {
        create: [
          {
            productId: products[0].id,
            quantity: 1,
            price: 199.99,
          },
          {
            productId: products[3].id,
            quantity: 1,
            price: 29.99,
          },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      userId: users[1].id,
      total: 419.98,
      status: "PENDING",
      items: {
        create: [
          {
            productId: products[1].id,
            quantity: 1,
            price: 299.99,
          },
          {
            productId: products[4].id,
            quantity: 1,
            price: 129.99,
          },
        ],
      },
    },
  });

  console.log("✅ Created orders:", [order1, order2].length);
  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

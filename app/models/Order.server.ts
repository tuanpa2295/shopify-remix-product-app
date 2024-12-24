import type { Order, Prisma} from '@prisma/client';

export async function createOrder(data: Omit<Order, "id" | "createdAt">) {
  return await prisma.order.create({ data });
}

export const createOrUpdate = async (orderData: Prisma.OrderWhereInput) => {
  const { orderId, ...data } = orderData;
  try {
    const existingUser = await prisma.order.findFirst({
      where: { orderId },
    })

    if (existingUser) {
      return await prisma.order.update({ where: { orderId: orderId as string }, data: data as Prisma.OrderUpdateInput })
    } else {
      return await prisma.order.create({ data: orderData as Prisma.OrderCreateInput })
    }
  } catch (error) {
    console.error(error)
  }
}

export async function getOrderById(id: number) {
  return await prisma.order.findUnique({ where: { id } });
}

export async function updateOrder(id: number, data: Partial<Order>) {
  return await prisma.order.update({
    where: { id },
    data,
  });
}

export async function deleteOrder(id: number) {
  return await prisma.order.delete({ where: { id } });
}

export async function getOrders() {
  const orders = await prisma.order.findMany({
    orderBy: { id: "desc" },
    where: {}
  });

  return orders;
}

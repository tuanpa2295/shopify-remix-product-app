import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { Card, EmptyState, Layout, Page, IndexTable } from "@shopify/polaris";
import { Order } from "@prisma/client";
import { getOrders } from "app/models/Order.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const orders = await getOrders();

  return json({
    orders,
  });
}


const EmptyOrderState = () => (
  <EmptyState
    heading="View orders of your shop"
    image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
  >
    <p>Allow user to view orders and export to CSV.</p>
  </EmptyState>
);

const OrderTableRow = ({ order }: { order: Order }) => {
  const orderUrl = `https://admin.shopify.com/store/tuanpa20-application/orders/${order.orderId}`;

  return (
    <IndexTable.Row id={order.id.toString()} position={order.id}>
      <IndexTable.Cell>
        <Link to={`${orderUrl}`} target="_blank">
          {order.orderId}
        </Link>
      </IndexTable.Cell>
      <IndexTable.Cell>{order.orderNumber}</IndexTable.Cell>
      <IndexTable.Cell>{order.customerFullName}</IndexTable.Cell>
      <IndexTable.Cell>{order.customerAddress}</IndexTable.Cell>
      <IndexTable.Cell>{order.customerEmail}</IndexTable.Cell>
      <IndexTable.Cell>{order.totalPrice}</IndexTable.Cell>
      <IndexTable.Cell>
        {new Date(order.createdAt).toDateString()}
      </IndexTable.Cell>
      <IndexTable.Cell>{order.tags}</IndexTable.Cell>
      <IndexTable.Cell>
        <Link to={`/app/orders/${order.orderId}`}>Edit Order</Link>
      </IndexTable.Cell>
    </IndexTable.Row>
  );
};

const OrderTable = ({ orders }: { orders: Order[] }) => (
  <IndexTable
    resourceName={{
      singular: "Order",
      plural: "Orders",
    }}
    itemCount={orders.length}
    headings={[
      { title: "Id" },
      { title: "Order Number" },
      { title: "Customer Full Name" },
      { title: "Customer Address" },
      { title: "Customer Email" },
      { title: "Price" },
      { title: "Date Created" },
      { title: "Tags" },
      { title: "Action" },
    ]}
    selectable={false}
  >
    {orders.map((order) => (
      <OrderTableRow key={order.id} order={order} />
    ))}
  </IndexTable>
);

export default function Index() {
  const { orders }: { orders: any[] } = useLoaderData();

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card padding="0">
            {orders.length === 0 ? (
              <EmptyOrderState />
            ) : (
              <OrderTable orders={orders} />
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  )

}

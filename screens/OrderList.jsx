import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import { GET_ALL_ORDERS } from "../graphql/queries";

const PAGE_SIZE = 10;

const OrderList = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [allOrders, setAllOrders] = useState([]);

  const { data, loading, error, refetch, fetchMore } = useQuery(
    GET_ALL_ORDERS,
    {
      variables: { page: 0, take: PAGE_SIZE },
    }
  );

  useEffect(() => {
    if (data?.getAllOrder?.orders) {
      if (page === 1) {
        setAllOrders(data.getAllOrder.orders);
      } else {
        setAllOrders((prev) => [...prev, ...data.getAllOrder.orders]);
      }
    }
  }, [data, page]);

  const filteredOrders = allOrders.filter((order) =>
    order.orderProducts?.[0]?.productName
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleLoadMore = () => {
    if (data?.getAllOrder?.orders) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMore({ variables: { page: 0, take: 10 } });
    }
  };

  const renderOrderCard = ({ item }) => {
    const product = item.orderProducts?.[0];
    const productName = product?.productName || "Product Name";
    const quantity = product?.quantity || 1;
    const orderedDate = item?.createdAt
      ? new Date(item.createdAt).toLocaleDateString()
      : "N/A";
    const isDelivered = item?.status?.toLowerCase() === "delivered";

    return (
      <View style={styles.card}>
        <Text numberOfLines={2} style={styles.title}>
          {productName}
        </Text>
        <Text style={styles.meta}>
          Order ID: <Text style={styles.highlight}>{item.id}</Text>
        </Text>
        <Text style={styles.meta}>Qty: {quantity}</Text>
        <Text style={styles.meta}>Ordered On: {orderedDate}</Text>

        <TouchableOpacity
          style={styles.detailsBtn}
          onPress={() =>
            navigation.navigate("MyOrdersProfile", { orderId: item.id })
          }
        >
          <Text style={styles.detailsText}>Order Details</Text>
        </TouchableOpacity>

        {!isDelivered && (
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() =>
              navigation.navigate("CancelOrderScreen", { orderId: item.id })
            }
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading && page === 1) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b49f4" />
        <Text>Loading orders...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>Failed to load orders</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Orders</Text>

      <View style={styles.searchRow}>
        <View style={styles.searchInputWrapper}>
          <Ionicons
            name="search"
            size={18}
            color="#777"
            style={{ marginHorizontal: 8 }}
          />
          <TextInput
            placeholder="Search your order here"
            style={styles.searchInput}
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => {
            setPage(1);
            refetch({ page: 0, take: PAGE_SIZE });
          }}
        >
          <Ionicons name="refresh" size={18} color="#fff" />
          <Text style={styles.filterText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {filteredOrders.length === 0 && !loading ? (
        <View style={{ alignItems: "center", marginTop: 40 }}>
          <Text style={{ color: "#888", fontSize: 16 }}>Order not found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.variantName}
          renderItem={renderOrderCard}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.2}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          windowSize={10}
          updateCellsBatchingPeriod={50}
          ListFooterComponent={
            loading && page > 0 ? (
              <View style={{ padding: 16 }}>
                <ActivityIndicator size="small" color="#3b49f4" />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};

export default OrderList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 22,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 12,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontFamily: "Poppins-Regular",
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3b49f4",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  filterText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Poppins-Medium",
    marginLeft: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    elevation: 2,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },
  title: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    marginBottom: 6,
    color: "#333",
  },
  meta: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#555",
    marginBottom: 4,
  },
  highlight: {
    fontFamily: "Poppins-Medium",
    color: "#3b49f4",
  },
  detailsBtn: {
    marginTop: 10,
    backgroundColor: "#3b49f4",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  detailsText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Poppins-Medium",
  },
  cancelBtn: {
    marginTop: 10,
    backgroundColor: "#f1f1f1",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  cancelText: {
    color: "#d11a2a",
    fontSize: 13,
    fontFamily: "Poppins-Medium",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

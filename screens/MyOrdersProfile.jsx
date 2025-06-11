import React, { useState, useEffect } from "react";
import {View,Text,TextInput,StyleSheet,FlatList,Image,TouchableOpacity,ActivityIndicator,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@apollo/client";
import { GET_ALL_ORDERS, GET_ORDER } from "../graphql/queries";
import BottomNav from "../components/HomeScreen/BottomNav";

const PAGE_SIZE = 10;

const MyOrdersProfile = ({route}) => {
  const { orderId} = route.params;
  const navigation = useNavigation();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [allOrders, setAllOrders] = useState([]);

  console.log("Order id :" , orderId)

 

  const { data, loading, error, refetch, fetchMore } = useQuery(
    GET_ORDER,
    {
      variables: {getOrderId: orderId },
      fetchPolicy: "network-only",
    }
  );

  console.log("data:", data)



  const orders = allOrders;

  const renderOrderCard = ({ item }) => {
    let status = "";
    if (item.orderStatus === "DELIVERED") status = "order_again";
    else if (item.orderStatus === "CANCELLED") status = "cancelled";
    else if (item.orderStatus === "REPLACED") status = "replace";
    else status = "track";

    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <Image
            source={{
              uri: item?.productImages?.[0] || "",
            }}
            style={styles.image}
          />
          <View style={styles.details}>
            <Text numberOfLines={2} style={styles.title}>
              {item?.productName || "Product"}
            </Text>
            <Text style={styles.meta}>
              Variant: <Text style={styles.seller}>{item.variantName}</Text>
            </Text>
            <Text style={styles.meta}>
              Qty: {item?.quantity || 1}
            </Text>
            <Text style={styles.meta}>
              Delivered on {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          {status === "track" && (
            <>
              <TouchableOpacity
                style={styles.trackBtn}
                onPress={() =>
                  navigation.navigate("OrderDetailScreen", { orderId: item.id })
                }
              >
                <Text style={styles.trackText}>Track Order</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() =>
                  navigation.navigate("CancelOrder", { orderId: item.id })
                }
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
          {status === "order_again" && (
            <>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() =>
                  navigation.navigate("ProductDetails", {
                    productId: item.orderProducts?.[0]?.productId,
                  })
                }
              >
                <Text style={styles.primaryText}>Order Again</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.outlineBtn}
                onPress={() =>
                  navigation.navigate("WriteReview", { orderId: item.id })
                }
              >
                <Text style={styles.outlineText}>Review Product</Text>
              </TouchableOpacity>
            </>
          )}
          {status === "replace" && (
            <>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() =>
                  navigation.navigate("ReplaceOrder", { orderId: item.id })
                }
              >
                <Text style={styles.primaryText}>Replace Order</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.outlineBtn}
                onPress={() =>
                  navigation.navigate("WriteReview", { orderId: item.id })
                }
              >
                <Text style={styles.outlineText}>Review Product</Text>
              </TouchableOpacity>
            </>
          )}
          {status === "cancelled" && (
            <View style={styles.cancelledBox}>
              <Text style={styles.cancelledText}>Cancelled</Text>
            </View>
          )}
        </View>
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

  const filteredOrders = orders.filter((order) =>
    order.orderProducts?.[0]?.productName
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleLoadMore = () => {
    // Only fetch more if there are more orders
    if (data?.getAllOrder?.orders?.length === PAGE_SIZE) {
      setPage((prev) => prev + 1);
      fetchMore({
        variables: { page: page + 1, take: PAGE_SIZE },
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.header}>My Orders</Text>
      </View>

      {/* Search & Filter */}
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
        <TouchableOpacity style={styles.filterBtn} onPress={() => refetch()}>
          <Ionicons name="filter" size={18} color="#fff" />
          <Text style={styles.filterText}>Filters</Text>
        </TouchableOpacity>
      </View>

      <BottomNav />

      {data?.getOrder?.orderProducts?.length === 0 && !loading ? (
        <View style={{ alignItems: "center", marginTop: 40 }}>
          <Text style={{ color: "#888", fontSize: 16 }}>Order not found</Text>
        </View>
      ) : (
        <FlatList
          data={data?.getOrder?.orderProducts}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderCard}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading && page > 1 ? (
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

export default MyOrdersProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  headerRow: {
    marginBottom: 12,
  },
  header: {
    fontSize: 22,
    fontFamily: "Poppins-SemiBold",
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
  row: {
    flexDirection: "row",
    marginBottom: 12,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 6,
    marginRight: 12,
  },
  details: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    marginBottom: 2,
    color: "#333",
  },
  meta: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#555",
  },
  seller: {
    color: "#e67e22",
    fontFamily: "Poppins-Medium",
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  trackBtn: {
    flex: 1,
    backgroundColor: "#ff9800",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  trackText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Poppins-Medium",
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#eee",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  cancelText: {
    color: "#555",
    fontSize: 13,
    fontFamily: "Poppins-Medium",
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: "#3b49f4",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  primaryText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Poppins-Medium",
  },
  outlineBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#3b49f4",
    backgroundColor: "#fff",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  outlineText: {
    color: "#3b49f4",
    fontSize: 13,
    fontFamily: "Poppins-Medium",
  },
  cancelledBox: {
    flex: 1,
    backgroundColor: "#e53935",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  cancelledText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Poppins-Medium",
  },
});

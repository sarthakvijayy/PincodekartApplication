import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_ADDRESS_QUERY } from "../graphql/queries";
import {
  CREATE_ADDRESS,
  DELETE_ADDRESS,
  UPDATE_ADDRESS,
} from "../graphql/mutations";
import { Ionicons } from "@expo/vector-icons";

const AddressScreen = ({ setSelectedAddressId, selectedAddressId }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    mobileNo: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    pincode: "",
    state: "",
    country: "",
  });

  const { data, loading, error, refetch } = useQuery(GET_ALL_ADDRESS_QUERY, {
    variables: { page: 0, take: 10 },
  });

  const [updateAddress, { loading: updating }] = useMutation(UPDATE_ADDRESS, {
    onCompleted: () => {
      Alert.alert("Success", "Address updated successfully!");
      refetch();
      setModalVisible(false);
    },
    onError: (err) => {
      console.log(err);
      Alert.alert("Error", err.message);
    },
  });

  const [deleteAddress, { loading: deletingAddress }] = useMutation(DELETE_ADDRESS);
  const [createAddress, { loading: creatingAddressLoading }] = useMutation(CREATE_ADDRESS);

  const handleCreate = async () => {
    const pincodeInt = parseInt(form.pincode, 10);
    if (isNaN(pincodeInt)) return Alert.alert("Invalid pincode");

    try {
      await createAddress({
        variables: {
          fullName: form.fullName,
          mobileNo: form.mobileNo,
          addressLine1: form.addressLine1,
          addressLine2: form.addressLine2,
          city: form.city,
          pincode: pincodeInt,
          state: form.state,
          country: form.country,
        },
      });

      Alert.alert("Success", "Address created successfully!");
      setModalVisible(false);
      resetForm();
      await refetch();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", error.message || "Failed to create address.");
    }
  };

  const handleUpdate = async () => {
    if (!selectedAddressId) return Alert.alert("Select an address first");
    const pincodeInt = parseInt(form.pincode, 10);
    if (isNaN(pincodeInt)) return Alert.alert("Invalid pincode");

    try {
      await updateAddress({
        variables: {
          updateAddressId: selectedAddressId,
          fullName: form.fullName,
          mobileNo: form.mobileNo,
          addressLine1: form.addressLine1,
          addressLine2: form.addressLine2,
          city: form.city,
          state: form.state,
          country: form.country,
          pincode: pincodeInt,
        },
      });
      resetForm();
    } catch (error) {
      console.log("update error", error);
    }
  };

  const handleAddressDelete = async (id) => {
    try {
      await deleteAddress({
        variables: { deleteAddressId: id },
      });
      await refetch();
    } catch (error) {
      console.log("delete error", error);
    }
  };

  const resetForm = () => {
    setForm({
      fullName: "",
      mobileNo: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      pincode: "",
      state: "",
      country: "",
    });
    setIsEdit(false);
    setSelectedAddressId(null);
  };

  const renderAddressItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.addressItem,
        selectedAddressId === item.id && styles.selectedAddress,
      ]}
      onPress={() => setSelectedAddressId(item.id)}
    >
      <View style={styles.radioContainer}>
        <Ionicons
          name={
            selectedAddressId === item.id
              ? "radio-button-on"
              : "radio-button-off"
          }
          size={20}
          color="#007BFF"
        />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.addressLabel}>{item.fullName}</Text>
          <Text>{item.mobileNo}</Text>
          <Text>
            {item.addressLine1}, {item.addressLine2}
          </Text>
          <Text>
            {item.city}, {item.state} - {item.pincode}
          </Text>
          <Text>{item.country}</Text>

          <View style={{ flexDirection: "row", marginTop: 5 }}>
            <TouchableOpacity
              onPress={() => {
                setSelectedAddressId(item.id);
                setForm({
                  fullName: item.fullName || "",
                  mobileNo: item.mobileNo || "",
                  addressLine1: item.addressLine1 || "",
                  addressLine2: item.addressLine2 || "",
                  city: item.city || "",
                  pincode: item.pincode?.toString() || "",
                  state: item.state || "",
                  country: item.country || "",
                });
                setIsEdit(true);
                setModalVisible(true);
              }}
              style={{ marginRight: 12 }}
            >
              <Ionicons name="pencil-outline" size={22} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleAddressDelete(item.id)}>
              {deletingAddress ? (
                <ActivityIndicator size="small" />
              ) : (
                <Ionicons name="trash-outline" size={22} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;
  if (error) return <Text style={{ color: "red", marginTop: 20 }}>{error.message}</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.headContainer}>
        <Text style={styles.heading}>Your Addresses</Text>
        <TouchableOpacity
          style={styles.createBTN}
          onPress={() => {
            resetForm();
            setModalVisible(true);
          }}
        >
          <Ionicons name="add-outline" size={20} color={"blue"} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={data?.getAllAddress?.addresses || []}
        keyExtractor={(item) => item.id}
        renderItem={renderAddressItem}
        ListEmptyComponent={<Text>No addresses found.</Text>}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              {isEdit ? "Edit Address" : "Add New Address"}
            </Text>

            {[
              { label: "Full Name", key: "fullName" },
              { label: "Mobile No.", key: "mobileNo" },
              { label: "Address Line 1", key: "addressLine1" },
              { label: "Address Line 2", key: "addressLine2" },
              { label: "City", key: "city" },
              { label: "Pincode", key: "pincode" },
              { label: "State", key: "state" },
              { label: "Country", key: "country" },
            ].map((field) => (
              <TextInput
                key={field.key}
                placeholder={field.label}
                style={styles.input}
                value={form[field.key]}
                onChangeText={(text) => setForm({ ...form, [field.key]: text })}
                keyboardType={field.key === "pincode" || field.key === "mobileNo" ? "numeric" : "default"}
              />
            ))}

            <TouchableOpacity
              style={styles.button}
              onPress={isEdit ? handleUpdate : handleCreate}
              disabled={updating || creatingAddressLoading}
            >
              <Text style={styles.buttonText}>
                {isEdit
                  ? updating
                    ? "Updating..."
                    : "Update Address"
                  : creatingAddressLoading
                  ? "Saving..."
                  : "Save Address"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={[styles.button, { backgroundColor: "gray", marginTop: 10 }]}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddressScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  headContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  createBTN: {
    borderWidth: 2,
    borderColor: "blue",
    borderRadius: 100,
    padding: 6,
  },
  heading: { fontSize: 18, fontWeight: "bold", marginVertical: 12 },
  addressItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedAddress: {
    borderColor: "#007BFF",
    backgroundColor: "#E6F0FF",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  addressLabel: { fontWeight: "600", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

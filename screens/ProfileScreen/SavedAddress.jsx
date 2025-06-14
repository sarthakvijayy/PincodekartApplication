import React, { useState } from "react";
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
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_ADDRESS_QUERY } from "../../graphql/queries";
import {
  CREATE_ADDRESS,
  DELETE_ADDRESS,
  UPDATE_ADDRESS,
} from "../../graphql/mutations";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const SavedAddress = () => {
  const route = useRoute();
  const navigation = useNavigation();
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

  const [selectedAddressId, setSelectedAddressId] = useState(
    route?.params?.selectedAddressId || null
  );
  const updateSelectedAddressId =
    route?.params?.setSelectedAddressId || setSelectedAddressId;

  const { data, loading, error, refetch } = useQuery(GET_ALL_ADDRESS_QUERY, {
    variables: { page: 0, take: 10 },
  });

  const [updateAddress, { loading: updating }] = useMutation(UPDATE_ADDRESS, {
    onCompleted: () => {
      Alert.alert("Success", "Address updated successfully!");
      refetch();
      setModalVisible(false);
    },
    onError: (err) => Alert.alert("Error", err.message),
  });

  const [deleteAddress, { loading: deletingAddress }] = useMutation(DELETE_ADDRESS);
  const [createAddress, { loading: creatingAddressLoading }] = useMutation(CREATE_ADDRESS);

  const handleCreate = async () => {
    const pincodeInt = parseInt(form.pincode, 10);
    if (isNaN(pincodeInt)) return Alert.alert("Invalid pincode");

    try {
      await createAddress({ variables: { ...form, pincode: pincodeInt } });
      Alert.alert("Success", "Address created successfully!");
      setModalVisible(false);
      resetForm();
      await refetch();
    } catch (error) {
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
          ...form,
          pincode: pincodeInt,
        },
      });
      resetForm();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleAddressDelete = async (id) => {
    try {
      await deleteAddress({ variables: { deleteAddressId: id } });
      await refetch();
    } catch (error) {
      Alert.alert("Delete failed", error.message);
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
        selectedAddressId === item?.id && styles.selectedAddress,
      ]}
      onPress={() => {
        setSelectedAddressId(item?.id);
        updateSelectedAddressId(item?.id);
      }}
    >
      <View style={styles.radioContainer}>
        <Ionicons
          name={
            selectedAddressId === item?.id
              ? "radio-button-on"
              : "radio-button-off"
          }
          size={20}
          color="#007BFF"
        />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.addressLabel}>{item?.fullName}</Text>
          <Text>{item?.mobileNo}</Text>
          <Text>{item?.addressLine1}, {item?.addressLine2}</Text>
          <Text>{item?.city}, {item?.state} - {item?.pincode}</Text>
          <Text>{item?.country}</Text>

          <View style={{ flexDirection: "row", marginTop: 5 }}>
            <TouchableOpacity
              onPress={() => {
                setSelectedAddressId(item?.id);
                updateSelectedAddressId(item?.id);
                setForm({
                  fullName: item?.fullName || "",
                  mobileNo: item?.mobileNo || "",
                  addressLine1: item?.addressLine1 || "",
                  addressLine2: item?.addressLine2 || "",
                  city: item?.city || "",
                  pincode: item?.pincode?.toString() || "",
                  state: item?.state || "",
                  country: item?.country || "",
                });
                setIsEdit(true);
                setModalVisible(true);
              }}
              style={{ marginRight: 12 }}
            >
              <Ionicons name="pencil-outline" size={22} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleAddressDelete(item?.id)}>
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
      {/* Header */}
      <LinearGradient
        colors={["#184977", "#459BEC", "#73BBFF", "#DFF0FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.headerContainer}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Saved Addresses</Text>
        </View>
      </LinearGradient>

      {/* Address Section */}
      <View style={styles.headContainer}>
        <Text style={styles.heading}>Your Address</Text>
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
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        renderItem={renderAddressItem}
        ListEmptyComponent={<Text>No addresses found.</Text>}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {/* Bottom Save New Address Button */}
      <TouchableOpacity
        style={[styles.button, { margin: 16 }]}
        onPress={() => {
          resetForm();
          setModalVisible(true);
        }}
      >
        <Text style={styles.buttonText}>Save Address</Text>
      </TouchableOpacity>

      {/* Address Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1 }}
            >
              <ScrollView contentContainerStyle={styles.modalView}>
                <Text style={styles.modalText}>
                  {isEdit ? "Edit Address" : "Add New Address"}
                </Text>

                {[{ label: "Full Name", key: "fullName" },
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
                    onChangeText={(text) =>
                      setForm((prev) => ({ ...prev, [field.key]: text }))
                    }
                    keyboardType={["pincode", "mobileNo"].includes(field.key) ? "numeric" : "default"}
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
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default SavedAddress;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerContainer: {
    paddingVertical: 45,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  headContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 12,
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
    marginHorizontal: 16,
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
    flexGrow: 1,
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
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    borderColor: '#2A55E5',
    borderWidth: 2,
  },
  buttonText: { 
    color: "#2A55E5", 
    fontWeight: "bold", 
    fontSize: 16 },
});

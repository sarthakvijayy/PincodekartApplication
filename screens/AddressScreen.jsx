import React, { useState } from "react";
import {View,Text,TextInput,FlatList,TouchableOpacity,StyleSheet,ActivityIndicator,Modal,ScrollView,} from "react-native";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_ADDRESS_QUERY } from "../graphql/queries";
import {
  CREATE_ADDRESS,
  DELETE_ADDRESS,
  UPDATE_ADDRESS,
} from "../graphql/mutations";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";

const AddressScreen = ({
  selectedAddressId,
  setSelectedAddressId,
  onProceed,
}) => {
  const route = useRoute();
  const [isEdit, setIsEdit] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [addressValidationError, setAddressValidationError] =
    useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [form, setForm] = useState({
    fullName: "",
    mobileNo: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    pincode: "",
    state: "",
    country: "",
    tag: "Home",
  });

  const updateSelectedAddressId =
    route?.params?.setSelectedAddressId || setSelectedAddressId;

  const { data, loading, error, refetch } = useQuery(
    GET_ALL_ADDRESS_QUERY,
    {
      variables: { page: 0, take: 10 },
    }
  );

  const [updateAddress] = useMutation(UPDATE_ADDRESS, {
    onCompleted: () => {
      resetForm();
      refetch();
      setModalVisible(false);
    },
    onError: (err) => console.log("Update Error:", err.message),
  });

  const [deleteAddress] = useMutation(DELETE_ADDRESS);
  const [createAddress] = useMutation(CREATE_ADDRESS);

  const validateForm = () => {
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      if (!form[key]) {
        newErrors[key] = `* ${key.replace(
          /([A-Z])/g,
          " $1"
        )} is required`;
      }
    });
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    try {
      await createAddress({
        variables: { ...form, pincode: parseInt(form.pincode, 10) },
      });
      resetForm();
      refetch();
      setModalVisible(false);
    } catch (error) {
      console.log("Create Error:", error.message);
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
    try {
      await updateAddress({
        variables: {
          updateAddressId: selectedAddressId,
          ...form,
          pincode: parseInt(form.pincode, 10),
        },
      });
      resetForm();
    } catch (error) {
      console.log("Update Error:", error.message);
    }
  };

  const handleAddressDelete = async (id) => {
    try {
      await deleteAddress({ variables: { deleteAddressId: id } });
      await refetch();
    } catch (error) {
      console.log("Delete Error:", error.message);
    }
  };

  const handleProceed = () => {
    if (!selectedAddressId) {
      setAddressValidationError(true);
    } else {
      setAddressValidationError(false);
      if (route?.params?.onProceed) {
        route.params.onProceed();
      } else if (typeof onProceed === "function") {
        onProceed();
      }
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
      tag: "Home",
    });
    setFormErrors({});
    setIsEdit(false);
    setSelectedAddressId(null);
  };

  const renderAddressItem = ({ item }) => {
    const isSelected = selectedAddressId === item?.id;
    return (
      <TouchableOpacity
        style={[
          styles.cardContainer,
          isSelected && styles.selectedCard,
        ]}
        onPress={() => {
          setSelectedAddressId(item?.id);
          updateSelectedAddressId(item?.id);
          setAddressValidationError(false);
        }}
      >
        <View style={styles.cardHeader}>
          <View style={styles.radioNameWrapper}>
            <Ionicons
              name={
                isSelected ? "radio-button-on" : "radio-button-off"
              }
              size={20}
              color="#007BFF"
            />
            <Text style={styles.nameText}>{item?.fullName}</Text>
            {/* <View style={styles.tag}>
              <Text style={styles.tagText}>
                {item?.tag || "Home"}
              </Text>
            </View> */}
          </View>

          <View style={{ flexDirection: "row", gap: 12 }}>
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
                  // tag: item?.tag || "Home",
                });
                setIsEdit(true);
                setModalVisible(true);
              }}
            >
              <Ionicons
                name="pencil-outline"
                size={20}
                color="#007BFF"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleAddressDelete(item?.id)}
            >
              <Ionicons name="trash" size={20} color="red" />
            </TouchableOpacity>
          </View>
        </View>


              <Text style={styles.addressText}>
                 {"Mobile No."}{item?.mobileNo},
              </Text>

        <Text style={styles.addressText}>
          
         

          {item?.addressLine1}, {item?.addressLine2}, {item?.city},{" "}
          {item?.state}, {item?.country} - {item?.pincode}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;
  if (error)
    return <Text style={{ color: "red" }}>{error.message}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Addresses</Text>

      {addressValidationError && (
        <Text style={styles.errorText}>* Please select address</Text>
      )}

      <FlatList
        data={data?.getAllAddress?.addresses || []}
        keyExtractor={(item) => item?.id?.toString()}
        renderItem={renderAddressItem}
        ListEmptyComponent={<Text>No addresses found.</Text>}
      />

      <TouchableOpacity
        style={[styles.button, styles.addAddressButton]}
        onPress={() => {
          resetForm();
          setModalVisible(true);
        }}
      >
        <Text style={styles.addAddressText}>Add New Address</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleProceed}>
        <Text style={styles.buttonText}>Deliver to this Address</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <ScrollView>
              <Text style={styles.modalText}>
                {isEdit ? "Edit Address" : "Add New Address"}
              </Text>

              {/* <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  marginVertical: 12,
                }}
              >
                {["Home"].map((tagOption) => (
                  <TouchableOpacity
                    key={tagOption}
                    onPress={() =>
                      setForm({ ...form, tag: tagOption })
                    }
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons
                      name={
                        form.tag === tagOption
                          ? "radio-button-on"
                          : "radio-button-off"
                      }
                      size={18}
                      color="#007BFF"
                    />
                    <Text style={{ marginLeft: 6 }}>{tagOption}</Text>
                  </TouchableOpacity>
                ))}
              </View> */}

              {[
                "fullName",
                "mobileNo",
                "addressLine1",
                "addressLine2",
                "city",
                "pincode",
                "state",
                "country",
              ].map((key) => (
                <View key={key} style={{ marginBottom: 12 }}>
                  <TextInput
                    placeholder={key.replace(/([A-Z])/g)}
                    style={styles.input}
                    value={form[key]}
                    onChangeText={(text) => {
                      setForm({ ...form, [key]: text });
                      setFormErrors({ ...formErrors, [key]: "" });
                    }}
                    keyboardType={
                      ["pincode", "mobileNo"].includes(key)
                        ? "numeric"
                        : "default"
                    }
                  />
                  {formErrors[key] && (
                    <Text style={styles.errorText}>
                      {formErrors[key]}
                    </Text>
                  )}
                </View>
              ))}

              <TouchableOpacity
                style={styles.button}
                onPress={isEdit ? handleUpdate : handleCreate}
              >
                <Text style={styles.buttonText}>
                  {isEdit ? "Update Address" : "Save Address"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.button, { backgroundColor: "gray" }]}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 12,
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedCard: {
    borderColor: "#007BFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  radioNameWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  nameText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  tag: {
    marginLeft: 10,
    backgroundColor: "#eee",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: 12,
    color: "#555",
  },
  addressText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 2,
    marginLeft: 2,
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
    maxHeight: "90%",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
  },
  addAddressButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#007BFF",
  },
  addAddressText: {
    color: "#007BFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AddressScreen from "./AddressScreen";
import OrderSummaryScreen from "./OrderSummaryScreen";
import PaymentScreen from "./PaymentScreen";
import OrderConfirmedScreen from "./OrderConfirmedScreen";

const steps = ["Address", "Order Summary", "Payment", "Confirmed"];
const { width } = Dimensions.get("window");
const stepWidth = (width - 32) / steps.length;

const MyOrdersScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <AddressScreen
            setSelectedAddressId={setSelectedAddressId}
            selectedAddressId={selectedAddressId}
            onProceed={() => setCurrentStep(1)}
          />
        );
      case 1:
        return (
          <OrderSummaryScreen
            selectedAddressId={selectedAddressId}
            setSelectedSlot={setSelectedSlot}
            selectedSlot={selectedSlot}
            onProceed={() => setCurrentStep(2)}
          />
        );
      case 2:
        return (
          <PaymentScreen
            addressId={selectedAddressId}
            selectedSlot={selectedSlot}
            setCurrentStep={setCurrentStep} // 👈 Passed for step control from inside
          />
        );
      case 3:
        return <OrderConfirmedScreen />;
      default:
        return null;
    }
  };

  const handleGoBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Arrow and Title */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backBtn}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={currentStep === 0 ? "transparent" : "#000"}
          />
        </TouchableOpacity>
        <Text style={styles.title}>My Orders</Text>
      </View>

      {/* Step Progress Indicator */}
      <View style={styles.stepContainer}>
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <React.Fragment key={index}>
              {index !== 0 && (
                <View
                  style={[
                    styles.progressLine,
                    {
                      backgroundColor:
                        index - 1 <= currentStep ? "#3D5AFE" : "#ccc",
                    },
                  ]}
                />
              )}
              <TouchableOpacity style={styles.stepWrapper}>
                <View
                  style={[
                    styles.circle,
                    {
                      backgroundColor: isCompleted
                        ? "#3D5AFE"
                        : isActive
                        ? "#fff"
                        : "#fff",
                      borderColor: isCompleted
                        ? "#3D5AFE"
                        : isActive
                        ? "#3D5AFE"
                        : "#ccc",
                    },
                  ]}
                >
                  {isCompleted ? (
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>
                      ✓
                    </Text>
                  ) : isActive ? (
                    <View style={styles.innerDot} />
                  ) : null}
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    {
                      color:
                        isActive || isCompleted ? "#3D5AFE" : "#999",
                    },
                  ]}
                >
                  {step}
                </Text>
              </TouchableOpacity>
            </React.Fragment>
          );
        })}
      </View>

      {/* Step Content */}
      {renderStepContent()}
    </View>
  );
};

export default MyOrdersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 32,
    backgroundColor: "#fff",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backBtn: {
    padding: 6,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    marginBottom: 24,
  },
  stepWrapper: {
    width: stepWidth,
    alignItems: "center",
    zIndex: 2,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3D5AFE",
  },
  progressLine: {
    position: "absolute",
    top: 11,
    left: stepWidth / 2,
    width: "78%",
    height: 2,
    zIndex: 1,
  },
  stepLabel: {
    fontSize: 10,
    marginTop: 6,
    textAlign: "center",
  },
});

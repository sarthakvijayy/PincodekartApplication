import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

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

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <AddressScreen
            setSelectedAddressId={setSelectedAddressId}
            selectedAddressId={selectedAddressId}
          />
        );
      case 1:
        return (
          <OrderSummaryScreen selectedAddressId={selectedAddressId} />
        );
      case 2:
        return (
          <PaymentScreen
            addressId={selectedAddressId}
            setCurrentStep={setCurrentStep}
          />
        );
      case 3:
        return <OrderConfirmedScreen />;
      default:
        return null;
    }
  };

  const handleStepClick = (index) => {
    // aap chahe to step click se bhi jump karwa sakte ho
    setCurrentStep(index);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Orders</Text>

      {/* Step progress bar */}
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
              <TouchableOpacity
                style={styles.stepWrapper}
                onPress={() => handleStepClick(index)}
                activeOpacity={0.7}
              >
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
                    <Text
                      style={{ color: "white", fontWeight: "bold" }}
                    >
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

      {/* Step content */}
      {renderStepContent()}

      {/* Next button */}
      {currentStep !== 2 && currentStep < steps.length - 1 && (
        <TouchableOpacity
          style={styles.nextBtn}
          onPress={() => setCurrentStep(currentStep + 1)}
        >
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default MyOrdersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 48,
    backgroundColor: "#fff",
  },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 24 },
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
  nextBtn: {
    marginTop: 24,
    marginBottom: 24,
    backgroundColor: "#3D5AFE",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  nextText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});

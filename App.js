import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  SafeAreaView,
  StatusBar,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Camera } from "expo-camera";
import { MaterialIcons } from "@expo/vector-icons";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_300Light,
} from "@expo-google-fonts/inter";
import { ScaledSheet } from "react-native-size-matters";

export default function App() {
  // Load fonts asynchronously
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_300Light,
  });

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cameraRef, setCameraRef] = useState(null);
  const [torchOn, setTorchOn] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setScannedData({ type, data });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setScanned(false);
    setScannedData(null);
  };

  const toggleTorch = () => {
    setTorchOn((prev) => !prev);
  };

  if (!fontsLoaded || hasPermission === null) {
    return null; // Return a loading indicator while fonts and permissions are loading
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8EEF1" />
      <View style={styles.top}>
        <Text style={styles.header}>Scan</Text>
      </View>
      <View style={styles.middle}>
        <View style={styles.Qr}>
          <Camera
            style={styles.camera}
            type={Camera.Constants.Type.back}
            ref={(ref) => {
              setCameraRef(ref);
            }}
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            flashMode={
              torchOn
                ? Camera.Constants.FlashMode.torch
                : Camera.Constants.FlashMode.off
            }
          >
            <View style={styles.overlay}></View>
          </Camera>
        </View>
      </View>
      <View style={styles.bottom}>
        <TouchableOpacity style={styles.btn} onPress={toggleTorch}>
          <MaterialIcons
            name={torchOn ? "highlight" : "highlight"}
            size={40}
            color={torchOn ? "#007AFF" : "#9d9d9d"}
          />
        </TouchableOpacity>
      </View>

      {/* Popup Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showModal}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Scanned Data:</Text>
            <Text style={styles.modalData}>{scannedData?.data}</Text>
            <TouchableOpacity onPress={handleCloseModal}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8EEF1",
  },
  top: {
    flex: 0.15,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontFamily: "Inter_500Medium",
    fontSize: 30,
    color: "#595959",
  },
  middle: {
    flex: 0.7,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottom: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  btn: {
    backgroundColor: "white",
    height: 80,
    width: 70,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  Qr: {
    height: "90%",
    width: "90%",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    height: "78%",
    backgroundColor: "#E8EEF1",
    padding: 20,
    borderRadius: 30,
    alignItems: "center",
  },
  modalText: {
    fontSize: 20,
    marginBottom: 10,
    fontFamily: "Inter_500Medium",
  },
  modalData: {
    fontSize: 16,
    marginBottom: 20,
    fontFamily: "Inter_400Regular",
  },
  closeButton: {
    fontSize: 18,
    color: "#007AFF",
    fontFamily: "Inter_500Medium",
  },
});

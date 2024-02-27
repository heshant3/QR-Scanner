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
  ScrollView,
  Linking,
} from "react-native";
import { Camera } from "expo-camera";
import {
  MaterialIcons,
  FontAwesome6,
  MaterialCommunityIcons,
  AntDesign,
  FontAwesome5,
} from "@expo/vector-icons";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_300Light,
} from "@expo-google-fonts/inter";
import { ScaledSheet } from "react-native-size-matters";
import * as Clipboard from "expo-clipboard";
import { BlurView } from "expo-blur";

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

  // Copy function
  const handleCopyData = () => {
    if (scannedData?.data) {
      Clipboard.setString(scannedData.data);
      alert("Data copied to clipboard!");
    } else {
      alert("No data to copy!");
    }
  };

  // Search Web Or APP function
  const handleSearchWeb = () => {
    if (scannedData?.data) {
      const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
      if (urlRegex.test(scannedData.data)) {
        Linking.openURL(scannedData.data); // If the scanned data is a URL, open it directly
      } else {
        const searchQuery = encodeURIComponent(scannedData.data);
        const searchUrl = `https://www.google.com/search?q=${searchQuery}`;
        Linking.openURL(searchUrl); // If not a URL, perform a web search
      }
    } else {
      alert("No data to search!");
    }
  };

  // Facebook Search function
  const handleSearchFacebook = () => {
    if (scannedData?.data) {
      const searchQuery = encodeURIComponent(scannedData.data);
      const searchUrl = `https://www.facebook.com/search/top/?q=${searchQuery}`;
      Linking.openURL(searchUrl);
    } else {
      alert("No data to search!");
    }
  };

  // Amazon Search function
  const handleSearchAmazon = () => {
    if (scannedData?.data) {
      const searchQuery = encodeURIComponent(scannedData.data);
      const searchUrl = `https://www.amazon.com/s?k=${searchQuery}`;
      Linking.openURL(searchUrl);
    } else {
      alert("No data to search!");
    }
  };

  // Ebay Search function
  const handleSearchEbay = () => {
    if (scannedData?.data) {
      const searchQuery = encodeURIComponent(scannedData.data);
      const searchUrl = `https://www.ebay.com/sch/i.html?_nkw=${searchQuery}`;
      Linking.openURL(searchUrl);
    } else {
      alert("No data to search!");
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    // console.log("Scanned type:", type); // Log the type property
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
        <BlurView
          experimentalBlurMethod="dimezisBlurView"
          intensity={30}
          tint="systemChromeMaterialDark"
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            {/* Conditionally render based on the scanned type */}
            {scannedData?.type == "32" ? (
              <Text style={styles.modalText}>Barcode</Text>
            ) : (
              <Text style={styles.modalText}>QR Code</Text>
            )}
            <View style={styles.ModelDataView}>
              <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.modalDataText}> {scannedData?.data}</Text>
              </ScrollView>
            </View>
            <View style={styles.Banner}></View>

            <View style={styles.SearchView}>
              <View>
                <Text style={styles.SearchText}>Search on</Text>
              </View>
              <View style={styles.SearchBtnView}>
                <TouchableOpacity
                  style={styles.bottombtn}
                  onPress={handleCopyData}
                >
                  <FontAwesome6 name="copy" size={30} color="#49A8FF" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.bottombtn}
                  onPress={handleSearchWeb}
                >
                  <MaterialCommunityIcons
                    name="web"
                    size={30}
                    color="#49A8FF"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.bottombtn}
                  onPress={handleSearchAmazon}
                >
                  <AntDesign name="amazon" size={30} color="#49A8FF" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.bottombtn}
                  onPress={handleSearchEbay}
                >
                  <FontAwesome5 name="ebay" size={30} color="#49A8FF" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.bottombtn}
                  onPress={handleSearchFacebook}
                >
                  <FontAwesome5 name="facebook" size={30} color="#49A8FF" />
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <TouchableOpacity
                onPress={handleCloseModal}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
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
  },
  modalContent: {
    width: "90%",
    height: "70%",
    backgroundColor: "#E8EEF1",
    padding: 20,
    borderRadius: 30,
    alignItems: "center",
  },
  modalText: {
    fontSize: "30@ms0.1",
    marginBottom: 20,
    fontFamily: "Inter_500Medium",
    color: "#007AFF",
  },
  modalData: {
    fontSize: 16,
    marginBottom: 20,
    fontFamily: "Inter_400Regular",
  },

  ModelDataView: {
    backgroundColor: "#fff",
    height: "25%",
    width: "99%",
    borderRadius: 25,
    padding: 20,
    overflow: "hidden",
  },

  modalDataText: {
    fontSize: "24@ms0.1",
    color: "#595959",
    fontFamily: "Inter_500Medium",
  },

  Banner: {
    marginVertical: 10,
    // backgroundColor: "red",
    height: "20%",
    width: "100%",
    borderRadius: 25,
    overflow: "hidden",
  },

  SearchView: {
    width: "100%",
  },

  SearchText: {
    fontSize: "24@ms0.1",
    color: "#595959",
    fontFamily: "Inter_400Regular",
  },

  SearchBtnView: {
    marginTop: 20,
    flexDirection: "row",
    overflow: "hidden",
    justifyContent: "space-between",
  },

  bottombtn: {
    height: 55,
    width: 55,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginVertical: 10,
    // marginLeft: 10,
  },

  closeButton: {
    marginTop: 50,
    height: 40,
    width: 100,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  closeButtonText: {
    fontSize: 18,
    color: "#007AFF",
    fontFamily: "Inter_500Medium",
  },

  scroll: {
    // justifyContent: "center",
  },
});

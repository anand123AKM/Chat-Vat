import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import CustomAlert from "./CustomAlert"; // Import the custom alert component

const Contact = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleSubmit = () => {
    if (!name || !email || !message) {
      setAlertMessage("Please fill out all fields.");
      setAlertVisible(true);
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailPattern.test(email)) {
      setAlertMessage("Please enter a valid data");
      setAlertVisible(true);
      setName("");
      setEmail("");
      setMessage("");
      return;
    }

    setAlertMessage("Thank you! Your message has been sent.");
    setAlertVisible(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Contact</Text>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Name"
            placeholderTextColor="#003f5c"
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Email"
            placeholderTextColor="#003f5c"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={[styles.TextInput, styles.textArea]}
            placeholder="Message"
            placeholderTextColor="#003f5c"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
          />
        </View>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Send</Text>
        </TouchableOpacity>
        <CustomAlert
          visible={alertVisible}
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    alignItems: "center",
    paddingTop: 150,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#03346E",
  },
  inputView: {
    backgroundColor: "#6EACDA",
    borderRadius: 30,
    width: "80%",
    height: 45,
    marginBottom: 20,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  TextInput: {
    height: 50,
    flex: 1,
    color: "#003f5c",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  submitBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#03346E",
  },
  submitText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Contact;

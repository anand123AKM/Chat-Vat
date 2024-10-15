import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db, storage } from "./Firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/ChatList");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access media library is required!");
        return;
      }
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const pickedImage = result.assets[0].uri;
        setImage(pickedImage);
        const uriParts = pickedImage.split("/");
        const fileName = uriParts[uriParts.length - 1];
        setImageName(fileName);
      } else {
        console.log("Image selection canceled or no valid image found.");
      }
    } catch (error) {
      console.error("Error picking image:", error.message);
    }
  };

  const ImageUpload = async () => {
    try {
      let user = auth.currentUser;
      if (!user) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        user = auth.currentUser;
      }

      if (!user) {
        throw new Error("User not authenticated");
      }

      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
        const storageRef = ref(storage, `images/${imageName}`);
        await uploadBytes(storageRef, blob);
        console.log("Image uploaded successfully!");

        const url = await getDownloadURL(storageRef);
        console.log("Image URL: ", url);

        await updateDoc(doc(db, "users", user.uid), { image: url });
        console.log("User image URL saved successfully!");
      } else {
        console.log("No image selected for upload!");
      }
    } catch (error) {
      console.error("Error uploading image:", error.message);
    }
  };

  const SignIn = async () => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User Logged In Successfully!");
      router.push("/ChatList");
    } catch (error) {
      console.log(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const SignUp = async () => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userData = {
        uid: user.uid,
        email: user.email,
        name: name,
        image: "",
        createdAt: new Date(),
      };
      await setDoc(doc(db, "users", user.uid), userData);
      console.log("User data saved successfully!");

      await ImageUpload();
      router.push("/ChatList");
    } catch (error) {
      console.log("Sign Up Error: ", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require("../assets/log2.jpg")} />
      {!loading && (
        <>
          <View style={styles.inputView}>
            <TouchableOpacity style={styles.button} onPress={pickImage}>
              {image ? (
                <Text style={styles.imageNameText}>{imageName}</Text>
              ) : (
                <Text style={styles.TextInput}>Upload Profile Pic</Text>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.TextInput}
              placeholder="Name"
              placeholderTextColor="#003f5c"
              onChangeText={(name) => setName(name)}
              value={name}
            />
          </View>
        </>
      )}
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Email"
          placeholderTextColor="#003f5c"
          onChangeText={(email) => setEmail(email)}
          value={email}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Password"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
          value={password}
        />
      </View>

      {loading ? (
        <>
          <TouchableOpacity onPress={() => setLoading(false)}>
            <Text style={styles.forgot_button}>Don't Have Account?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={SignIn} style={styles.loginBtn}>
            <Text style={styles.loginText}>LOGIN</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity onPress={() => setLoading(true)}>
            <Text style={styles.forgot_button}>Have Account?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={SignUp} style={styles.loginBtn}>
            <Text style={styles.loginText}>SIGN UP</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    marginBottom: 40,
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  inputView: {
    backgroundColor: "#6EACDA",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
    color: "#003f5c",
  },
  forgot_button: {
    height: 30,
    marginBottom: 30,
    fontWeight: "bold",
    color: "#064663",
  },
  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#03346E",
  },
  loginText: {
    color: "white",
    fontWeight: "bold",
  },
  imageNameText: {
    marginTop: 10,
    color: "#003f5c",
    fontWeight: "bold",
  },
});

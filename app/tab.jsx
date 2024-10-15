import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  collection,
  doc,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  where,
} from "firebase/firestore";
import uuid from "react-native-uuid";
import { db, auth } from "./Firebase";
import { DateContext } from "./TimeContext";

const TabScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userName, userImage, chatId } = route.params || {};
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const { setDate } = useContext(DateContext);

  useEffect(() => {
    if (userName) {
      navigation.setOptions({
        headerTitle: () => (
          <View style={styles.headerTitleContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign
                name="arrowleft"
                size={24}
                color="white"
                style={{ fontWeight: "700" }}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{userName}</Text>
            <Ionicons
              name="call-outline"
              size={22}
              color="white"
              style={{ marginLeft: 20 }}
            />
            <Ionicons
              name="videocam-sharp"
              size={22}
              color="white"
              style={{ marginLeft: 20 }}
            />
          </View>
        ),
        headerRight: () =>
          userImage === "" ? (
            <Text
              key={userName}
              style={{
                fontSize: 22,
                color: "#03346E",
                fontWeight: "bold",
                paddingTop: 2,
                paddingLeft: 11,
                width: 40,
                height: 40,
                marginRight: 10,
                marginTop: 3,
                borderRadius: 50,
                borderWidth: 2,
                borderColor: "white",
                backgroundColor: "#03346E",
                color: "white",
              }}
            >
              {userName.charAt(0).toUpperCase()}
            </Text>
          ) : (
            <Image
              source={{ uri: userImage }}
              style={styles.headerImage}
              cache="force-cache"
            />
          ),
        headerLeft: () => null,
      });
    }
  }, [userName, userImage, navigation]);

  useEffect(() => {
    if (!chatId) {
      console.error("chatId is undefined");
      return;
    }

    const messagesRef = collection(db, "messages", chatId, "chatMessages");

    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    if (msg.trim()) {
      const messagesRef = collection(db, "messages", chatId, "chatMessages");

      const newMessage = {
        text: msg,
        sender: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      };

      await addDoc(messagesRef, newMessage);

      setMsg("");
    }
  };

  const renderItem = ({ item }) => (
    <View>
      <Text
        style={
          item.sender === auth.currentUser.uid
            ? styles.sentMessage
            : styles.receivedMessage
        }
      >
        {item.text}
      </Text>
      <Text style={styles.timestamp}>
        {item.createdAt?.toDate().toLocaleTimeString()}
        {setDate(
          item.createdAt
            ?.toDate()
            .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        )}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.StartCon}>Start the conversation below</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.messageContainer}
      />
      <View style={styles.msgsend}>
        <TextInput
          value={msg}
          onChangeText={(text) => setMsg(text)}
          placeholder="Type a message"
          style={styles.input}
        />
        <TouchableOpacity onPress={sendMessage}>
          <FontAwesome name="send" size={24} style={styles.send} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TabScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  StartCon: {
    fontSize: 10,
    textAlign: "center",
    padding: 15,
    color: "gray",
  },
  msgsend: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 20,
    padding: 9,
    margin: 10,
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  send: {
    padding: 10,
    backgroundColor: "gray",
    borderRadius: 25,
    color: "white",
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 10,
  },
  headerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  messageContainer: {
    paddingTop: 10,
    paddingHorizontal: 10,
    flex: 1,
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#6EACDA",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: "70%",
    color: "white",
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#DCDCDC",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: "70%",
  },
  timestamp: {
    fontSize: 10,
    color: "gray",
    alignSelf: "center",
  },
});

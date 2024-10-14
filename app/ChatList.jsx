import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { db, auth } from "./Firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { TouchableOpacity } from "react-native";
import uuid from "react-native-uuid"; // Import react-native-uuid

const ChatVat = () => {
  const [userdata, setUserdata] = useState([]);
  const [lastMessages, setLastMessages] = useState({});

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const users = querySnapshot.docs.map((doc) => doc.data());
        setUserdata(users);

        users.forEach(async (user) => {
          const messagesQuery = query(
            collection(db, "messages"),
            where("sender", "==", user.name),
            orderBy("createdAt", "desc"),
            limit(1)
          );
          const messagesSnapshot = await getDocs(messagesQuery);
          if (!messagesSnapshot.empty) {
            const lastMsg = messagesSnapshot.docs[0].data();
            setLastMessages((prevMessages) => ({
              ...prevMessages,
              [user.uid]: lastMsg,
            }));
          }
        });
      } catch (error) {
        console.error("Error fetching messages: ", error);
      }
    };

    fetchMessages();
  }, []);

  const router = useRouter();

  const HandleChat = async (user) => {
    try {
      // Create a composite key for the chat document ID
      const currentUserId = auth.currentUser.uid;
      const selectedUserId = user.uid;
      const chatId = [currentUserId, selectedUserId].sort().join("_");

      // Check if a chat already exists between the current user and the selected user
      const chatDocRef = doc(db, "chats", chatId);
      const chatDocSnapshot = await getDoc(chatDocRef);

      if (!chatDocSnapshot.exists()) {
        // Create a new document in the chats collection with the composite key
        await setDoc(chatDocRef, {
          chatId: chatId,
          participants: [currentUserId, selectedUserId],
          createdAt: new Date(),
        });
      }

      // Navigate to the /tab route with the chatId as a parameter
      router.push({
        pathname: "/tab",
        params: { userName: user.name, userImage: user.image, chatId: chatId },
      });
    } catch (error) {
      console.error("Error creating chat: ", error);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return `${date.toLocaleTimeString()}`;
  };

  return (
    <>
      <View style={styles.container}>
        {userdata.map((user) => (
          <TouchableOpacity key={user.uid} onPress={() => HandleChat(user)}>
            <View key={user.uid} style={styles.container1}>
              {user.image === "" ? (
                <Text
                  key={user.uid}
                  style={{
                    fontSize: 22,
                    color: "#03346E",
                    fontWeight: "bold",
                    paddingTop: 3,
                    paddingLeft: 12,
                    width: 40,
                    height: 40,
                    marginRight: 10,
                    borderRadius: 50,
                    borderWidth: 1,
                    borderColor: "#03346E",
                  }}
                >
                  {user.name.charAt(0)}
                </Text>
              ) : (
                <Image
                  source={{ uri: user.image }}
                  style={{
                    width: 40,
                    height: 40,
                    marginRight: 10,
                    borderRadius: 50,
                    borderWidth: 1,
                    borderColor: "#03346E",
                  }}
                />
              )}
              <View style={styles.MsgContainer}>
                <View style={styles.textContainer}>
                  <Text key={user.uid} style={styles.userName}>
                    {user.name}{" "}
                    {auth.currentUser.uid === user.uid ? "(You)" : ""}
                  </Text>
                  <Text style={styles.time}>
                    {lastMessages[user.uid]
                      ? formatDate(lastMessages[user.uid].createdAt)
                      : "Time"}
                  </Text>
                </View>
                <View>
                  <Text style={styles.time}>
                    {lastMessages[user.uid]
                      ? lastMessages[user.uid].text
                      : "No messages yet"}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
};

export default ChatVat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 12,
  },
  signOutButton: {
    marginTop: 20,
    alignItems: "center",
    fontWeight: "bold",
  },
  container1: {
    flexDirection: "row",
    backgroundColor: "#6EACDA",
    padding: 10,
    borderRadius: 10,
    margin: 7,
  },
  MsgContainer: {},
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 300,
  },
  userName: {
    fontSize: 16,
    color: "#03346E",
    fontWeight: "bold",
  },
  time: {
    fontSize: 12,
    color: "#03346E",
    paddingTop: 6,
  },
});

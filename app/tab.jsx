// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   TextInput,
//   FlatList,
// } from "react-native";
// import { useRoute, useNavigation } from "@react-navigation/native";
// import AntDesign from "@expo/vector-icons/AntDesign";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import FontAwesome from "@expo/vector-icons/FontAwesome";
// import {
//   collection,
//   addDoc,
//   query,
//   orderBy,
//   onSnapshot,
//   serverTimestamp,
//   where,
// } from "firebase/firestore";
// import uuid from "react-native-uuid";
// import { db } from "./Firebase";

// const TabScreen = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { userName, userImage } = route.params || {};
//   const [msg, setMsg] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [chatId, setChatId] = useState(route.params?.chatId || uuid.v4());

//   useEffect(() => {
//     if (userName) {
//       navigation.setOptions({
//         headerTitle: () => (
//           <View style={styles.headerTitleContainer}>
//             <TouchableOpacity onPress={() => navigation.goBack()}>
//               <AntDesign
//                 name="arrowleft"
//                 size={24}
//                 color="white"
//                 style={{ fontWeight: "700" }}
//               />
//             </TouchableOpacity>
//             <Text style={styles.headerTitle}>{userName}</Text>
//             <Ionicons
//               name="call-outline"
//               size={22}
//               color="white"
//               style={{ marginLeft: 20 }}
//             />
//             <Ionicons
//               name="videocam-sharp"
//               size={22}
//               color="white"
//               style={{ marginLeft: 20 }}
//             />
//           </View>
//         ),
//         headerRight: () => (
//           <Image
//             source={{ uri: userImage }}
//             style={styles.headerImage}
//             cache="force-cache"
//           />
//         ),
//         headerLeft: () => null,
//       });
//     }
//   }, [userName, userImage, navigation]);

//   useEffect(() => {
//     if (!chatId) {
//       console.error("chatId is undefined");
//       return;
//     }

//     const messagesRef = collection(db, "messages");

//     const q = query(
//       messagesRef,
//       where("chatId", "==", chatId),
//       orderBy("createdAt", "asc")
//     );

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const fetchedMessages = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setMessages(fetchedMessages);
//     });

//     return () => unsubscribe();
//   }, [chatId]);

//   const sendMessage = async () => {
//     if (msg.trim()) {
//       const messagesRef = collection(db, "messages");
//       await addDoc(messagesRef, {
//         text: msg,
//         sender: userName,
//         chatId: chatId,
//         createdAt: serverTimestamp(),
//       });
//       setMsg("");
//     }
//   };

//   const renderItem = ({ item }) => (
//     <View>
//       <Text
//         style={
//           item.sender === userName ? styles.sentMessage : styles.receivedMessage
//         }
//       >
//         {item.text}
//       </Text>
//       <Text style={styles.timestamp}>
//         {item.createdAt?.toDate().toLocaleTimeString()}
//       </Text>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={messages}
//         keyExtractor={(item) => item.id}
//         renderItem={renderItem}
//         contentContainerStyle={styles.messageContainer}
//       />
//       <View style={styles.msgsend}>
//         <TextInput
//           value={msg}
//           onChangeText={(text) => setMsg(text)}
//           placeholder="Type a message"
//           style={styles.input}
//         />
//         <TouchableOpacity onPress={sendMessage}>
//           <FontAwesome name="send" size={24} style={styles.send} />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default TabScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   msgsend: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     position: "absolute",
//     bottom: 0,
//     width: "100%",
//     padding: 10,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "gray",
//     borderRadius: 20,
//     padding: 7,
//     margin: 10,
//     flex: 1,
//     backgroundColor: "#f9f9f9",
//   },
//   send: {
//     padding: 10,
//     backgroundColor: "gray",
//     borderRadius: 25,
//     color: "white",
//   },
//   headerTitleContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   headerTitle: {
//     color: "white",
//     fontSize: 18,
//     fontWeight: "700",
//     marginLeft: 10,
//   },
//   headerImage: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 10,
//   },
//   messageContainer: {
//     paddingTop: 10,
//     paddingHorizontal: 10,
//     flex: 1,
//   },
//   sentMessage: {
//     alignSelf: "flex-end",
//     backgroundColor: "#6EACDA",
//     padding: 10,
//     borderRadius: 10,
//     marginBottom: 10,
//     maxWidth: "70%",
//     color: "white",
//   },
//   receivedMessage: {
//     alignSelf: "flex-start",
//     backgroundColor: "#ECECEC",
//     padding: 10,
//     borderRadius: 10,
//     marginBottom: 10,
//     maxWidth: "70%",
//   },
//   timestamp: {
//     fontSize: 10,
//     color: "gray",
//     alignSelf: "center",
//   },
// });

import React, { useState, useEffect } from "react";
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

const TabScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userName, userImage, chatId } = route.params || {};
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

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
        headerRight: () => (
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

    const messagesRef = collection(db, "messages", chatId, "chatMessages"); // Use sub-collection

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
      const messagesRef = collection(db, "messages", chatId, "chatMessages"); // Reference to the sub-collection

      // Create a new message document
      const newMessage = {
        text: msg,
        sender: auth.currentUser.uid, // Store sender's UID
        createdAt: serverTimestamp(),
      };

      // Add the new message to the sub-collection
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
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
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
    padding: 7,
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
    backgroundColor: "#ECECEC",
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

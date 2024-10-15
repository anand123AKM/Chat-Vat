import { createStackNavigator } from "@react-navigation/stack";
import { Image, Text } from "react-native";
import React from "react";
import Login from "./Login";
import ChatVat from "./ChatList";
import TabScreen from "./tab";
const Stack = createStackNavigator();
import { useRouter } from "expo-router";
import { auth } from "./Firebase";
import { Box, Button, Popover } from "native-base";
import { NativeBaseProvider } from "native-base";
import { TouchableOpacity } from "react-native";
import { DateProvider } from "./TimeContext";
import Contact from "./Contact";

export default function RootLayout() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push("/Login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleContact = () => {
    router.push("/Contact");
  };

  return (
    <DateProvider>
      <NativeBaseProvider>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: "#03346E",
              height: 100,
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        >
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerLeft: false,
            }}
          />
          <Stack.Screen
            name="ChatList"
            component={ChatVat}
            options={{
              title: "Chat-Vat",
              headerRight: () => (
                <Box style={{ alignSelf: "flex-end" }}>
                  <Popover
                    trigger={(triggerProps) => {
                      return (
                        <TouchableOpacity {...triggerProps}>
                          <Image
                            source={require("../assets/log2.jpg")}
                            style={{
                              width: 30,
                              height: 30,
                              marginRight: 10,
                              borderRadius: 50,
                              borderWidth: 1,
                              borderColor: "white",
                            }}
                          />
                        </TouchableOpacity>
                      );
                    }}
                  >
                    <Button
                      style={{
                        marginTop: 90,
                        marginLeft: 240,
                        zIndex: +1,
                        width: 150,
                        marginRight: 10,
                        backgroundColor: "#03346E",
                        borderWidth: 1,
                        borderColor: "white",
                        borderRadius: 30,
                      }}
                      onPress={handleSignOut}
                    >
                      Sign Out
                    </Button>
                    <Button
                      style={{
                        marginLeft: 240,
                        zIndex: +1,
                        width: 150,
                        marginRight: 10,
                        backgroundColor: "#03346E",
                        borderWidth: 1,
                        borderRadius: 30,
                        borderColor: "white",
                      }}
                      onPress={handleContact}
                    >
                      Contact
                    </Button>
                  </Popover>
                </Box>
              ),
              headerLeft: () => {
                return <Text></Text>;
              },
            }}
          />
          <Stack.Screen name="tab" component={TabScreen} />
          <Stack.Screen
            name="Contact"
            component={Contact}
            options={{ title: "Contact" }}
          />
        </Stack.Navigator>
      </NativeBaseProvider>
    </DateProvider>
  );
}

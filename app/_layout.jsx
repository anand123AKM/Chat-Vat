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

  return (
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
                          source={require("../assets/log2.png")}
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
                      marginTop: 40,
                      marginLeft: 240,
                      zIndex: +1,
                      width: 100,
                      backgroundColor: "#03346E",
                      borderWidth: 1,
                      borderColor: "white",
                    }}
                    onPress={handleSignOut}
                  >
                    Sign Out
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
      </Stack.Navigator>
    </NativeBaseProvider>
  );
}

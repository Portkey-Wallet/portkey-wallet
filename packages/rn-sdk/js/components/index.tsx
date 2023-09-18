import React from "react";
import { AppRegistry, StyleSheet, Text, View } from "react-native";

const Root = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.hello}>Hello, Portkey!!!</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  hello: {
    fontSize: 20,
    textAlign: "center",
    color: "red",
    margin: 10,
    backgroundColor: "yellow",
  },
});

export default Root;

AppRegistry.registerComponent("Root", () => Root);
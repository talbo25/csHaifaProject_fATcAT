import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const TopBar = () => {
  return (
    <View style={styles.container}>
      <Icon.Button
        name="home"
        size={15}
        color="white"
        backgroundColor="#3b5998"
        onPress={() => change_page("home")}
      >
        <Text style={{ fontFamily: "Arial", fontSize: 15, color: "white" }}>
          Home
        </Text>
      </Icon.Button>
      <Icon.Button
        name="newspaper-o"
        size={15}
        color="white"
        backgroundColor="#3b5998"
        onPress={() => change_page("logs_page")}
      >
        <Text style={{ fontFamily: "Arial", fontSize: 15, color: "white" }}>
          Logs
        </Text>
      </Icon.Button>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    height: 52,
    flexDirection: "row", // row
    backgroundColor: "#569532",
    alignItems: "center",
    justifyContent: "space-between", // center, space-around
    paddingLeft: 10,
    paddingRight: 10,
  },
});

export default TopBar;

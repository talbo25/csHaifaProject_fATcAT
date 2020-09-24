import React from "react";
import { StyleSheet, Text, View, Image, Button, Alert } from "react-native";

const PetEntry = ({ cat, change_edit_target }) => {
  const { name, bowl } = cat;
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: `https://robohash.org/${name}?size=100x100&set=set4` }}
        style={{ width: 30, height: 30 }}
      />
      <Text>{name}</Text>
      <Text>{bowl}</Text>
      <Button
        style={styles.ButtonContainer}
        onPress={() => change_edit_target(cat, "cat")}
        title="edit"
        color="#2196F3"
        accessibilityLabel="BOO BOO GA GA"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: "#81AE66",
    flexDirection: "row",
    justifyContent: "space-between", // center, space-around
    padding: 2,
    margin: 3,
    flex: 1,
  },
  ButtonContainer: {
    flex: 1,
    width: 20,
    justifyContent: "center",
  },
});
export default PetEntry;

import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableHighlight,
  Alert,
} from "react-native";

// change bowl state: open -> close / close -> open
const change_bowl_state = (bowlID) => {
  console.log("change_bowl_state ", bowlID);
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      bowlID: bowlID,
    }),
  };

  return fetch(`http://10.0.3.2:3000/gods_intervention`, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      if (data["id"]) {
        Alert.alert("DONE!");
      }
      return data;
    })
    .catch((err) => console.log(err));
};

const BowlEntry = ({ bowl, change_edit_target }) => {
  const { id, name } = bowl;
  return (
    <View style={styles.container}>
      <TouchableHighlight onPress={() => change_bowl_state(id)}>
        <Image
          source={{ uri: `https://robohash.org/${id}?size=100x100&set=set3` }}
          style={{ width: 30, height: 30 }}
        />
      </TouchableHighlight>
      <Text>{name}</Text>
      <Button
        style={styles.ButtonContainer}
        onPress={() => change_edit_target(bowl, "bowl")}
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
    flex: 3,
  },
  ButtonContainer: {
    flex: 1,
    width: 20,
    justifyContent: "center",
  },
});
export default BowlEntry;

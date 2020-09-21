import React, { useEffect, useState } from "react";
import { socket } from "./../../../Services/Socket/Socket";

import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableHighlight,
  Alert,
} from "react-native";

const BowlEntry = ({ bowl, change_edit_target, uniqueId }) => {
  console.log("BowlEntry ", bowl);
  const { id, name } = bowl;
  const [bowlMethod, setMethod] = useState({ method: bowl["method"] });

  socket.on("bowl_to_auto", (data) => {
    if (bowlMethod["method"] != "automatically") {
      Alert.alert(data.message);
      setMethod({ method: "automatically" });
    }
  });

  // change bowl state: open -> close / close -> open
  const change_bowl_state = (bowlID) => {
    console.log("change_bowl_state ", bowlID);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bowlID: bowlID,
        deviceID: uniqueId,
      }),
    };

    return fetch(
      `http://evening-woodland-16568.herokuapp.com/gods_intervention`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        if (data["id"]) {
          Alert.alert("DONE!");
          setMethod({ method: data["method"] });
        }
        return data;
      })
      .catch((err) => console.log(err));
  };

  return (
    <View style={styles.container}>
      <TouchableHighlight onPress={() => change_bowl_state(id)}>
        <React.Fragment>
          <Image
            source={{
              uri: `https://robohash.org/${id}?size=100x100&set=set3`,
            }}
            style={[
              styles.imageSize,
              bowlMethod.method === "manually" ? styles.manual_gray : null,
            ]}
          />
          <Image
            source={{
              uri: `https://robohash.org/${id}?size=100x100&set=set3`,
            }}
            style={{
              width: 30,
              height: 30,
              position: "absolute",
              opacity: 0.3,
            }}
          />
        </React.Fragment>
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
  imageSize: {
    width: 30,
    height: 30,
  },
  manual_gray: {
    tintColor: "gray",
  },
  manual_image: {
    position: "absolute",
    opacity: 0.3,
  },
});
export default BowlEntry;

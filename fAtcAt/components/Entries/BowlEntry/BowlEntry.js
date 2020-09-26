import React, { useEffect, useState } from "react";
import { socket } from "./../../../Services/Socket/Socket";
const { SERVER_ADDRESS } = require("./../../../Services/constants");

import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableHighlight,
  Alert,
} from "react-native";

const BowlEntry = ({ bowl, change_edit_target, remove_object, deviceID }) => {
  // console.log("BowlEntry ", bowl);
  const { bowlID, name } = bowl;
  const [bowlMethod, setMethod] = useState({ method: bowl["method"] });

  socket.once("bowl_to_auto", (data) => {
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
        deviceID: deviceID,
      }),
    };

    return fetch(`${SERVER_ADDRESS}/change_method`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log("data = ", data);
        if (data["bowlID"]) {
          Alert.alert("DONE!");
          setMethod({ method: data["method"] });
        }
        return data;
      })
      .catch((err) => console.warn(err));
  };

  return (
    <View style={styles.container}>
      <TouchableHighlight onPress={() => change_bowl_state(bowlID)}>
        <React.Fragment>
          <Image
            source={{
              uri: `https://robohash.org/${name}?size=100x100&set=set3`,
            }}
            style={[
              styles.imageSize,
              bowlMethod.method === "manually" ? styles.manual_gray : null,
            ]}
          />
          <Image
            source={{
              uri: `https://robohash.org/${name}?size=100x100&set=set3`,
            }}
            style={{
              flex: 3,
              width: 30,
              height: 30,
              position: "absolute",
              opacity: 0.3,
            }}
          />
        </React.Fragment>
      </TouchableHighlight>
      <Text style={{ flex: 6, textAlign: "center" }}>{name}</Text>
      <Button
        style={styles.ButtonContainer}
        onPress={() => change_edit_target(bowl, "bowl")}
        title="edit"
        color="#6998BC"
        accessibilityLabel="BOO BOO GA GA"
      />
      <Button
        style={styles.ButtonContainer2}
        onPress={() => remove_object("bowl", bowl.bowlID)}
        title="X"
        color="#AA5039"
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
    flex: 12,
  },
  ButtonContainer: {
    flex: 2,
    width: 20,
    justifyContent: "center",
  },
  ButtonContainer2: {
    flex: 1,
    // width: 10,
    justifyContent: "center",
    padding: 5,
  },
  imageSize: {
    flex: 3,
    width: 30,
    height: 30,
  },
  manual_gray: {
    tintColor: "gray",
  },
  normalImage: {
    position: "absolute",
    opacity: 1,
  },
});
export default BowlEntry;

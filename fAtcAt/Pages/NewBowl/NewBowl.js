import React from "react";
import Form from "../../components/Form/Form";
import { StyleSheet, View, Alert } from "react-native";
import {
  validateContent,
  validateLength,
} from "../../components/Form/validation";
const { SERVER_ADDRESS } = require("./../../Services/constants");

// verify if user's bowl exist on server
const find_bowl_button = (objectType, objectData) => {
  console.log("-D- find_bowl_button");
  console.log("-D- objectData = ", objectData);
  let { id, key } = objectData;

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      bowlID: id,
      key: key,
    }),
  };

  return fetch(`${SERVER_ADDRESS}/verify_bowl`, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      console.log("data = ", data);
      if (data["bowlID"]) {
        change_edit_target(data, "bowl");
        data = true;
      }
      return data;
    })
    .catch((err) => console.log(err));
};

const NewBowl = () => {
  console.log("NewBowl");
  const afterSubmitMessage = (result) => {
    console.log("afterSubmitMessage");
    if (result === true) {
      Alert.alert("Found Bowl!");
    } else {
      Alert.alert(result);
    }
  };

  return (
    <View style={styles.container}>
      <Form
        objectType="preNewBowl"
        fields={{
          id: {
            label: "ID",
            validators: [validateContent],
            type: "text",
          },
          key: {
            label: "key",
            validators: [validateContent],
            type: "password",
            inputProps: {
              secureTextEntry: true,
            },
          },
        }}
        buttonText="Find Bowl"
        action={find_bowl_button}
        afterSubmit={afterSubmitMessage}
        editTarget={{}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#C8EEB2",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

export default NewBowl;

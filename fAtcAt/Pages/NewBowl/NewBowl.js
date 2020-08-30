import React from "react";
import Form from "../../components/Form/Form";
import { StyleSheet, View, Alert } from "react-native";
import {
  validateContent,
  validateLength,
} from "../../components/Form/validation";

const NewBowl = ({ find_bowl_button }) => {
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

import React from "react";
import Form from "../../components/Form/Form";
import { StyleSheet, View, Alert } from "react-native";
import {
  hoursOptions,
  sexOptions,
} from "../../components/Form/constantOptions";
import {
  validateContent,
  validateLength,
} from "../../components/Form/validation";

const BowlForm = ({ cats, on_button_submit, editTarget }) => {
  // console.log("-D- NewBowl editTarget = ", editTarget);
  const afterSubmitMessage = (result) => {
    // NEED TO CHANGE!!!!!!!!!!!!!
    if (result) {
      Alert.alert("Yipi Ya");
    } else {
      Alert.alert("Oops... a problem");
    }
  };
  return (
    <View style={styles.container}>
      <Form
        objectType="bowl"
        fields={{
          name: {
            label: "Name",
            validators: [validateContent],
            type: "text",
          },
          // cats: {
          //   label: "Cats",
          //   type: "multipleSelect",
          //   options: cats.map((cat) => {
          //     return { id: cat.id, name: cat.name };
          //   }),
          // },
          activeHours: {
            label: "Active Hours",
            type: "timeRange",
            options: hoursOptions,
          },
        }}
        buttonText="Submit"
        action={on_button_submit}
        afterSubmit={afterSubmitMessage}
        editTarget={editTarget}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: "column",
    // backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

export default BowlForm;

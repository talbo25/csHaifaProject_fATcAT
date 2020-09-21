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

const CatForm = ({ bowls, on_button_submit, editTarget }) => {
  const afterSubmitMessage = (result) => {
    if (result) {
      Alert.alert("New Cat! Yipi Ya");
    } else {
      Alert.alert("Oops... a problem");
    }
  };

  return (
    <View style={styles.container}>
      <Form
        objectType="cat"
        fields={{
          name: {
            label: "Name",
            validators: [validateContent],
            type: "text",
          },
          sex: {
            label: "Sex",
            type: "picker",
            options: sexOptions,
          },
          weight: {
            label: "Weight",
            type: "slider",
            options: [0.5, 21.3],
          },
          bowlID: {
            label: "Bowl",
            type: "picker",
            options: bowls.map((bowl) => {
              return { value: bowl.id, label: bowl.name };
            }),
          },
          feedingHours: {
            label: "Feeding Hours",
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
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#C8EEB2",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

export default CatForm;

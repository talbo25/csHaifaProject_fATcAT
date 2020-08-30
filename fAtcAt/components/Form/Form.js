import React, { useState } from "react";
import { validateFields, hasValidationError } from "./validation";
import Field from "./Field";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  SafeAreaView,
} from "react-native";

const getInitialState = (fieldKeys) => {
  // console.log("-D- getInitialState target start");

  const state = {};
  fieldKeys.forEach((key) => {
    state[key] = "";
  });
  console.log("-D- getInitialState target end ", state);

  return state;
};

const getInitialStateAndValues = (fields, editTarget) => {
  const state = {};
  //init values
  Object.keys(fields).map((key) => {
    if (key in editTarget) {
      state[key] = editTarget[key];
    } else if ("options" in fields[key]) {
      if (fields[key]["type"] === "multipleSelect") {
        console.log("-D- what is this key - ", key);
        state[key] = [];
      } else {
        state[key] = fields[key]["options"][0];
      }
    } else {
      state[key] = "";
    }
  });
  return state;
};

const Form = ({
  objectType,
  fields,
  buttonText,
  action,
  afterSubmit,
  editTarget,
}) => {
  console.log("-D- Form ");
  const fieldKeys = Object.keys(fields);

  const [values, setValues] = useState(
    getInitialStateAndValues(fields, editTarget)
  );

  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState(
    getInitialState(fieldKeys)
  );

  const onChangeValue = (key, value) => {
    // console.log("-D- onChangeValue start");
    const newState = { ...values, [key]: value };
    setValues(newState);
  };

  const submit = async () => {
    console.log("-D- submit");
    setErrorMessage("");
    setValidationErrors(getInitialState(fieldKeys));

    const errors = validateFields(fields, values);
    if (hasValidationError(errors)) {
      console.log(errors);
      return setValidationErrors(errors);
    }
    // console.log("-D- before ", values);
    if (objectType !== "preNewBowl")
      values["id"] = "id" in editTarget ? editTarget["id"] : "-1";

    try {
      // console.log("-D- after ", values);
      const result = await action(objectType, values);
      await afterSubmit(result);

      // navigate to Home
    } catch (e) {
      setErrorMessage(e.message);
    }
  };

  return (
    <View>
      {/* <SafeAreaView style={styles.inputContainer}> */}
      <ScrollView>
        <View>
          {fieldKeys.map((key) => {
            const field = fields[key];
            const fieldError = validationErrors[key];
            return (
              <View key={key}>
                <Text>{field.label}</Text>
                <Field
                  keyna={key}
                  field={field}
                  value={values[key]}
                  onChangeValue={onChangeValue}
                />
                <Text style={styles.error}>{fieldError}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <Button title={buttonText} onPress={submit}>
        <Text>{buttonText}</Text>
      </Button>
      {/* </SafeAreaView> */}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  input: {
    height: 40,
    width: 300,
    paddingHorizontal: 5,
    backgroundColor: "white",
    marginBottom: 5,
  },
  inputContainer: {
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  error: { textAlign: "center", height: 17.5, color: "red" },
});

export default Form;

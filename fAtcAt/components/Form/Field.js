import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Picker,
  Slider,
  Text,
  SafeAreaView,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import MultiSelect from "react-native-multiple-select";

const Field = ({ keyna, field, value, onChangeValue }) => {
  if (field["type"] === "text") {
    return (
      <TextInput
        style={styles.input}
        {...field.inputProps}
        value={value}
        onChangeText={(text) => onChangeValue(keyna, text)}
      />
    );
  }
  if (field["type"] === "password") {
    return (
      <TextInput
        style={styles.input}
        {...field.inputProps}
        value={value}
        onChangeText={(text) => onChangeValue(keyna, text)}
      />
    );
  }
  if (field["type"] === "picker") {
    let radioButtons = [];
    let first = "";
    field["options"].map((option) => {
      if (first === "") {
        first = option;
      }
      radioButtons.push(<Picker.Item label={option} value={option} />);
    });
    return (
      <Picker
        selectedValue={value}
        onValueChange={(itemValue, itemIndex) => {
          onChangeValue(keyna, itemValue);
        }}
      >
        {radioButtons}
      </Picker>
    );
  }
  if (field["type"] === "slider") {
    let realVal = value;
    return (
      <View style={styles.row}>
        <View style={{ flex: 0.5 }}>
          <Text>{realVal}</Text>
        </View>
        <View style={{ flex: 3.5 }}>
          <Slider
            maximumValue={field["options"][1]}
            minimumValue={field["options"][0]}
            minimumTrackTintColor="#307ecc"
            maximumTrackTintColor="#000000"
            step={0.05}
            value={Number(realVal)}
            onValueChange={(sliderValue) => {
              onChangeValue(keyna, sliderValue.toFixed(2));
            }}
          />
        </View>
      </View>
    );
  }
  if (field["type"] === "timeRange") {
    let radioButtons = [];
    let first = "";

    field["options"].map((option) => {
      if (first === "") {
        first = option;
      }
      radioButtons.push(<Picker.Item label={option} value={option} />);
    });
    let m = value.match(/^s?(\d\d:\d\d)?e?(\d\d:\d\d)?$/);
    let sTime = "";
    let eTime = "";
    if (m) {
      if (m[1] != undefined) sTime = m[1];
      if (m[2] != undefined) eTime = m[2];
    }
    return (
      <View style={styles.row}>
        <View style={{ flex: 0.5 }}>
          <Text>start: </Text>
        </View>
        <View style={{ flex: 1.5 }}>
          <Picker
            selectedValue={sTime === "" ? first : sTime}
            onValueChange={(itemValue, itemIndex) => {
              onChangeValue(keyna, "s" + itemValue + "e" + eTime);
            }}
          >
            {radioButtons}
          </Picker>
        </View>
        <View style={{ flex: 0.5 }}>
          <Text>end:</Text>
        </View>
        <View style={{ flex: 1.5 }}>
          <Picker
            selectedValue={eTime === "" ? first : eTime}
            onValueChange={(itemValue, itemIndex) => {
              onChangeValue(keyna, "s" + sTime + "e" + itemValue);
            }}
          >
            {radioButtons}
          </Picker>
        </View>
      </View>
    );
  }
  if (field["type"] === "multipleSelect") {
    console.log("MISHMASH ", value);
    const [selectedItems, setItems] = useState(value);
    console.log("-D- GAZU! ", field["options"]);
    const items = field["options"];
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, padding: 10 }}>
          <MultiSelect
            hideTags
            items={items}
            uniqueKey="id"
            onSelectedItemsChange={(nsl) => {
              setItems(nsl);
              console.log("-items = ", items);
              console.log("-nsl = ", nsl);
              onChangeValue(keyna, nsl);
            }}
            selectedItems={selectedItems}
            selectText="Pick Items"
            searchInputPlaceholderText="Search Items..."
            onChangeInput={(text) => console.log(text)}
            tagRemoveIconColor="red"
            tagBorderColor="pink"
            tagTextColor="blue"
            selectedItemTextColor="green"
            selectedItemIconColor="pink"
            itemTextColor="#000"
            displayKey="name"
            searchInputStyle={{ color: "#CCC" }}
            submitButtonColor="#48d22b"
            submitButtonText="Submit"
          />
        </View>
      </SafeAreaView>
    );
  }
  return <Text>Bad property</Text>;
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: 300,
    paddingHorizontal: 5,
    backgroundColor: "white",
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
});

export default Field;

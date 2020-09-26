import React from "react";
import PetEntry from "../Entries/PetEntry/PetEntry";
import BowlEntry from "../Entries/BowlEntry/BowlEntry";
import { StyleSheet, Text, View } from "react-native";

const EntriesList = ({ head, entries, uniqueId, remove_object }) => {
  switch (head) {
    case "Cats":
      return (
        <View style={styles.EntryContainer}>
          {entries.map((cat, i) => {
            return (
              <PetEntry
                cat={cat}
                change_edit_target={change_edit_target}
                remove_object={remove_object}
                key={i}
              />
            );
          })}
        </View>
      );
      break;
    case "Bowls":
      return (
        <View style={styles.EntryContainer}>
          {entries.map((bowl, i) => {
            return (
              <BowlEntry
                bowl={bowl}
                change_edit_target={change_edit_target}
                remove_object={remove_object}
                deviceID={uniqueId}
                key={i}
              />
            );
          })}
        </View>
      );
      break;
    default:
      return <Text>error</Text>;
  }
};

const styles = StyleSheet.create({
  EntryContainer: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: "#91CB6E",
    justifyContent: "space-between", // center, space-around
    // flex: 1,
  },
});
export default EntriesList;

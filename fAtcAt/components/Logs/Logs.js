import React from "react";
import Log from "./Log";
import { StyleSheet, Text, View } from "react-native";

const Logs = ({ data }) => {
  console.log("LOGS ", data);
  return (
    <View style={styles.EntryContainer}>
      {data.map((log, i) => {
        return <Log log={log} />;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  EntryContainer: {
    alignSelf: "stretch",
    // backgroundColor: "#91CB6E",
    justifyContent: "space-between", // center, space-around
    // flexWrap: "wrap",
    margin: 5,
  },
});
export default Logs;

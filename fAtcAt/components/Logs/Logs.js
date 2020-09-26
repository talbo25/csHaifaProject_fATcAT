import React, { useState } from "react";
import Log from "./Log";
import { StyleSheet, Text, View } from "react-native";

const Logs = ({ data }) => {
  console.log("LOGS ", data);
  const [logs, setLogs] = useState(data);

  socket.once("refresh_logs", (data) => {
    setLogs(data.message);
  });

  return (
    <View style={styles.EntryContainer}>
      {logs.map((log, i) => {
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

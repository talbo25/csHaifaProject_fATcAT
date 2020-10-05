import React, { useEffect, useState } from "react";
import Log from "./Log";
import { StyleSheet, Text, View } from "react-native";

const Logs = ({ data }) => {
  // console.log("-D- LOGS ", data);
  const [logs, setLogs] = useState(data);

  useEffect(() => {
    setLogs(data);
  }, [data]);

  return (
    <View style={styles.EntryContainer}>
      {logs.map((log, i) => {
        return <Log log={log} key={i} />;
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

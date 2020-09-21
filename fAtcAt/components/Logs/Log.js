import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

const Log = ({ log }) => {
  console.log(" LOG= ", log);
  const { date, info } = log;
  const [numOfLines, setNum] = useState(1);

  const toggle_height = () => {
    if (numOfLines === 1) {
      setNum(10);
    } else {
      setNum(1);
    }
  };

  return (
    <TouchableOpacity onPress={() => toggle_height()}>
      <View style={styles.container}>
        <Text>{date}</Text>
        <Text numberOfLines={numOfLines} minimumFontScale={0.1}>
          {info}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    backgroundColor: "#81AE66",
    flexDirection: "column",
    padding: 15,
    margin: 5,
    flex: 1,
    flexWrap: "wrap",
    borderRadius: 90,
  },
  LogContainer_height: {
    alignSelf: "stretch",
  },
});
export default Log;

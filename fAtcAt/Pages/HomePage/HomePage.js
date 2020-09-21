import React from "react";
import { StyleSheet, Text, View } from "react-native";
import ListBox from "./../../components/ListBox/ListBox";

const HomePage = ({
  cats,
  bowls,
  change_page,
  change_edit_target,
  uniqueId,
}) => {
  return (
    <View style={styles.container}>
      <ListBox
        head="Cats"
        entries={cats}
        change_page={change_page}
        change_edit_target={change_edit_target}
        uniqueId={uniqueId}
      />
      <ListBox
        head="Bowls"
        entries={bowls}
        change_page={change_page}
        change_edit_target={change_edit_target}
        uniqueId={uniqueId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
    flexDirection: "column",
    // backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "stretch",
    padding: 20,
  },
});

export default HomePage;

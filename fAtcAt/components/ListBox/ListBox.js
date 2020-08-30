import React from "react";
import EntriesList from "../EntriesList/EntriesList";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  SafeAreaView,
} from "react-native";

const ListBox = ({ head, entries, change_page }) => {
  return (
    <View style={styles.container}>
      <View style={styles.HeaderContainer}>
        <Text style={[styles.text, { textAlign: "left" }]}>{head}:</Text>
      </View>
      <SafeAreaView style={styles.TableContainer}>
        <ScrollView style={styles.scrollView}>
          <EntriesList head={head} entries={entries} />
        </ScrollView>
      </SafeAreaView>
      <View style={styles.ButtonContainer}>
        <Button
          onPress={() =>
            head.toLowerCase() === "cats"
              ? change_edit_target({}, "cat")
              : // : change_edit_target({}, "bowl")
                change_page("new_bowl")
          }
          title="+ Add"
          color="#2196F3"
          accessibilityLabel="BOO BOO GA GA"
          flex="1"
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: "#91CB6E",
    justifyContent: "space-between", // center, space-around
    padding: 20,
    margin: 20,
    flex: 1,
  },
  HeaderContainer: {
    flex: 1,
    alignSelf: "flex-start",
  },
  TableContainer: {
    alignSelf: "stretch",
    flex: 4,
    // flexDirection: "row",
    backgroundColor: "#569532",
    padding: 5,
    margin: 10,
  },
  scrollView: {
    backgroundColor: "pink",
  },
  ButtonContainer: {
    flex: 1,
    width: 100,
    justifyContent: "center",
  },
});

export default ListBox;

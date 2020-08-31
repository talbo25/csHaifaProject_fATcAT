import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import TopBar from "./components/TopBar/TopBar";
import HomePage from "./Pages/HomePage/HomePage";
import CatForm from "./Pages/CatForm/CatForm";
import BowlForm from "./Pages/BowlForm/BowlForm";
import NewBowl from "./Pages/NewBowl/NewBowl";
import DeviceInfo from "react-native-device-info";

const initState = () => {
  const state = {
    currentPage: "home",
    editTarget: {},
  };
  return state;
};

const App = () => {
  const [state, setState] = useState(initState);
  const [deviceShit, setDeviceShit] = useState({ cats: [], bowls: [] });

  useEffect(() => {
    const fetchData = async () => {
      const state = {};
      const uniqueId = DeviceInfo.getUniqueId();
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: uniqueId,
        }),
      };
      fetch("http://10.0.3.2:3000/device_data", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data["cats"]) setDeviceShit(data);
        });
    };
    fetchData();
  }, []);

  const { cats, bowls } = deviceShit;
  change_page = (newPage) => {
    // console.log("change_page ", newPage);
    setState({ ...state, ["currentPage"]: newPage });
  };

  on_button_submit = (objectType, objectData) => {
    // edit or create new
    // console.log("-D- on_button_submit");

    const uniqueId = DeviceInfo.getUniqueId();
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        objectValues: objectData,
        currentDeviceID: uniqueId,
      }),
    };
    fetch(`http://10.0.3.2:3000/add_new_object/${objectType}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setDeviceShit(data);
      });

    // change_page("home");
    setState(initState);
    return true;
  };

  change_edit_target = (target, targetType) => {
    setState({ ...state, ["editTarget"]: target });
    state["editTarget"] = target;
    switch (targetType) {
      case "cat":
        change_page("cat_form");
        break;
      case "bowl":
        change_page("bowl_form");
        break;
      default:
        console.warn("Bad type");
    }
  };

  return (
    <View style={styles.mainContainer}>
      <TopBar style={styles.statusBar} />
      <View style={styles.pageContainer}>
        {state["currentPage"] === "home" ? (
          <HomePage
            cats={cats}
            bowls={bowls}
            change_page={change_page}
            change_edit_target={change_edit_target}
          />
        ) : state["currentPage"] === "cat_form" ? (
          <CatForm
            bowls={bowls}
            on_button_submit={on_button_submit}
            editTarget={state["editTarget"]}
          />
        ) : state["currentPage"] === "bowl_form" ? (
          <BowlForm
            cats={cats}
            on_button_submit={on_button_submit}
            editTarget={state["editTarget"]}
          />
        ) : (
          <NewBowl />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: "space-between",
    flexDirection: "column",
    flex: 11,
  },
  statusBar: {
    flex: 1,
    backgroundColor: "#2A5E0C",
  },
  pageContainer: {
    flex: 10,
    flexDirection: "column",
    backgroundColor: "#C8EEB2",
    justifyContent: "center",
    alignItems: "stretch",
    padding: 5,
  },
});
export default App;

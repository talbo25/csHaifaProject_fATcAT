import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import TopBar from "./components/TopBar/TopBar";
import HomePage from "./Pages/HomePage/HomePage";
import CatForm from "./Pages/CatForm/CatForm";
import BowlForm from "./Pages/BowlForm/BowlForm";
import NewBowl from "./Pages/NewBowl/NewBowl";
import LogsPage from "./Pages/LogsPage/LogsPage";
import DeviceInfo from "react-native-device-info";
import { socket } from "./Services/Socket/Socket";
const { SERVER_ADDRESS } = require("./Services/constants");

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
  const uniqueId = DeviceInfo.getUniqueId();

  useEffect(() => {
    const fetchData = async () => {
      const requestOptions = {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          deviceID: uniqueId,
        }),
      };
      // console.log("-D- reqOpt = ", requestOptions);

      fetch(`${SERVER_ADDRESS}/device_data`, requestOptions)
        .then((response) => {
          console.log("response= ", response);
          return response.json();
        })
        .then((data) => {
          console.log("data = ", data);
          if (data["cats"]) setDeviceShit(data);
        })
        .catch((err) => {
          console.log("OOPS... ", err);
        });
    };
    fetchData();

    socket.on("connect", function (data) {
      socket.emit("storeClientInfo", { customId: uniqueId });
    });
    socket.on("notification", (data) => {
      console.log(data);
    });
  }, []);

  const { cats, bowls } = deviceShit;
  change_page = (newPage) => {
    // console.log("change_page ", newPage);
    if (newPage === "cat_form" && bowls.length === 0) {
      Alert.alert("Error", "Must has at least one bowl before adding cats");
      return;
    }
    setState({ ...state, ["currentPage"]: newPage });
  };

  on_button_submit = (objectType, objectData) => {
    // edit or create new
    console.log("-D- on_button_submit");
    console.log("-D- objectType ", objectType);
    console.log("-D- objectData ", objectData);

    const uniqueId = DeviceInfo.getUniqueId();
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        objectValues: objectData,
        currentDeviceID: uniqueId,
      }),
    };
    fetch(`${SERVER_ADDRESS}/add_new_object/${objectType}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setDeviceShit(data);
      })
      .catch((err) => {
        console.log(err);
        return false;
      });

    setState(initState);
    return true;
  };

  remove_object = (objectType, objectID) => {
    console.log("-D- remove_object");
    console.log("-D- objectType ", objectType);
    console.log("-D- objectID ", objectID);

    const uniqueId = DeviceInfo.getUniqueId();
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        objectID: objectID,
        deviceID: uniqueId,
      }),
    };
    fetch(`${SERVER_ADDRESS}/remove_object/${objectType}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setDeviceShit(data);
      })
      .catch((err) => {
        console.log(err);
        return false;
      });

    setState(initState);
    return true;
  };

  get_current_weight = (bowlID) => {
    console.log("-D- get_current_weight");
    console.log("-D- bowlID ", bowlID);

    const uniqueId = DeviceInfo.getUniqueId();
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bowlID: bowlID,
        deviceID: uniqueId,
      }),
    };
    return fetch(`${SERVER_ADDRESS}/current_weight`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  };

  change_edit_target = (target, targetType) => {
    console.log("change_edit_target - start");
    console.log("target = ", target);
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
            uniqueId={uniqueId}
            remove_object={remove_object}
          />
        ) : state["currentPage"] === "cat_form" ? (
          <CatForm
            bowls={bowls}
            on_button_submit={on_button_submit}
            editTarget={state["editTarget"]}
            get_current_weight={get_current_weight}
          />
        ) : state["currentPage"] === "bowl_form" ? (
          <BowlForm
            cats={cats}
            on_button_submit={on_button_submit}
            editTarget={state["editTarget"]}
          />
        ) : state["currentPage"] === "logs_page" ? (
          <LogsPage uniqueId={uniqueId} />
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

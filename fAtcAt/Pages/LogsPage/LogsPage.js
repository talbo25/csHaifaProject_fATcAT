import React, { useState, useEffect } from "react";
import Logs from "../../components/Logs/Logs";
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from "react-native";
import { socket } from "./../../Services/Socket/Socket";

const data = [
  {
    date: "1/1/19 11:12",
    info: "blaaldbalbalablbalablalbablalblsdblfdlbdflbls",
  },
  {
    date: "5/2/20 12:30",
    info: "zzz",
  },
  {
    date: "1/4/19 11:22",
    info:
      "blaaldbalbalablbalablalba blalblsd blfdlbdflbls\ndsadasdad\ndsdsadasd",
  },
  {
    date: "4/1/19 09:40",
    info: "blaaldbalbalablbalablalbablalblsdblfdlbdflblsaaa",
  },
];
const edata = [];

const get_logs = (deviceID) => {
  console.log("get_logs ", deviceID);
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      deviceID: deviceID,
    }),
  };

  return fetch(`http://10.0.3.2:3000/logs`, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      if (data["logs"]) {
        console.log("-I- fetch logs - ", data["size"]);
        console.log(data["logs"]);
        return data["logs"];
      }
    })
    .catch((err) => {
      console.log(err);
      return [];
    });
};

const LogsPage = ({ uniqueId }) => {
  console.log("LogsBox");
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("get_logs ", uniqueId);
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceID: uniqueId,
        }),
      };

      return fetch(`http://10.0.3.2:3000/logs`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data["logs"]) {
            console.log("-I- fetch logs - ", data["size"]);
            console.log(data["logs"]);
            setLogs(data["logs"]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    console.log("BAMBA");
    fetchData();
  }, []);

  socket.on("update_logs", (data) => {
    console.log("-I- update logs - ", data["size"]);
    setLogs(data["logs"]);
  });

  console.log(logs);

  if (logs.length === 0) {
    return <Text style={styles.NoLogsContainer}>no logs....</Text>;
  }
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.TableContainer}>
        <ScrollView style={styles.scrollView}>
          <Logs data={logs} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    alignSelf: "stretch",
    justifyContent: "space-between", // center, space-around
    padding: 10,
    flex: 1,
  },
  HeaderContainer: {
    flex: 1,
    alignSelf: "flex-start",
  },
  TableContainer: {
    alignSelf: "stretch",
    flex: 4,
  },
  scrollView: {
    // backgroundColor: "#569532",
  },
  NoLogsContainer: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 50,
    marginTop: 0,
  },
});

export default LogsPage;

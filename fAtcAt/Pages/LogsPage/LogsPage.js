import React, { useState, useEffect } from "react";
import Logs from "../../components/Logs/Logs";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { socket } from "./../../Services/Socket/Socket";
const { SERVER_ADDRESS } = require("./../../Services/constants");

const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

const LogsPage = ({ uniqueId }) => {
  console.log("LogsBox");
  const [logs, setLogs] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    console.log("-I- onRefresh -- start");
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  }, []);

  const fetchData = async () => {
    console.log("get_logs ", uniqueId);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deviceID: uniqueId,
      }),
    };

    await fetch(`${SERVER_ADDRESS}/logs`, requestOptions)
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

  useEffect(() => {
    fetchData();
  }, []);

  socket.on("refresh_logs", (data) => {
    console.log("-I- update logs - ", data["size"]);
    logs.push(data["message"]);
  });

  console.log(logs);

  if (logs.length === 0) {
    return <Text style={styles.NoLogsContainer}>no logs....</Text>;
  }
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.TableContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
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

import * as React from "react";
import { StyleSheet, Text, View, Button, Dimensions } from "react-native";

import Player from "./src/Player";

class App extends React.Component {
  render() {
    return (
      <Player style={styles.container}>
        <Text>Hello, world!</Text>
      </Player>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default App;

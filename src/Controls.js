import * as React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

function Controls(props) {
  return (
    <View style={styles.root}>
      <View style={styles.metadataContainer}>
        <Text style={styles.songTitle}>Song Title</Text>
        <Text style={styles.artistName}>Artist Name</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity>
          <Icon name="ios-rewind" size={45} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="ios-play" size={45} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="ios-fastforward" size={45} />
        </TouchableOpacity>
      </View>

      <View style={styles.volumeContainer}>
        <Icon color="grey" name="ios-volume-mute" size={30} />
        <View style={styles.volumeBar} />
        <Icon color="grey" name="ios-volume-high" size={30} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    marginTop: 50,
    alignSelf: "stretch",
    alignItems: "center"
  },
  metadataContainer: {
    marginBottom: 40,
    marginHorizontal: "7%",
    alignItems: "center"
  },
  songTitle: {
    fontSize: 26,
    fontWeight: "bold"
  },
  artistName: {
    fontSize: 20
  },
  controls: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: "17%",
    marginBottom: 40
  },
  volumeContainer: {
    marginBottom: 40,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: "7%",
    opacity: 0.5
  },
  volumeBar: {
    flex: 1,
    height: 2,
    marginHorizontal: 15,
    backgroundColor: "lightgrey",
    borderRadius: 1.5
  }
});

export default Controls;

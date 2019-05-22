import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Dimensions,
  Image,
  TouchableOpacity
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Animated, { Easing } from "react-native-reanimated";
import { getInset } from "react-native-safe-area-view";
import {
  PanGestureHandler,
  State,
  BorderlessButton
} from "react-native-gesture-handler";

import runSpring from "./runSpring";
import Controls from "./Controls";
import springConfig from "./springConfig";

const {
  block,
  cond,
  eq,
  add,
  set,
  divide,
  multiply,
  sub,
  Extrapolate,
  debug,
  clockRunning,
  or,
  startClock,
  spring,
  stopClock,
  and,
  neq,
  diff
} = Animated;

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get("window");

const TOP_INSET = getInset("top", false);
const BOTTOM_INSET = getInset("bottom", false);
const MINIMIZED_HEIGHT = 75;
const ART_SIZE = 250;
const ART_MAXIMIZED_TOP = 60 + TOP_INSET;
const ART_MINIMIZED_TOP = 10;
const ART_MINIMIZED_SIZE = MINIMIZED_HEIGHT - 2 * ART_MINIMIZED_TOP;

const albumSource = {
  uri: "https://via.placeholder.com/500",
  width: ART_SIZE,
  height: ART_SIZE
};

const neg = val => multiply(-1, val);

class Player extends React.Component {
  gestureState = new Animated.Value(State.UNDETERMINED);
  panClock = new Animated.Clock();
  panY = new Animated.Value(0);
  gestureY = new Animated.Value(0);
  isClosing = new Animated.Value(0);

  openAnimClock = new Animated.Clock();
  openAnimState = new Animated.Value(0);
  openAnim = new Animated.Value(0);

  handlePan = Animated.event([
    {
      nativeEvent: {
        translationY: this.panY,
        state: this.gestureState
      }
    }
  ]);

  gestureSpringState = {
    finished: new Animated.Value(0),
    position: this.gestureY,
    velocity: new Animated.Value(0),
    time: new Animated.Value(0)
  };

  anim = block([
    cond(
      and(neq(diff(this.gestureState), 0), eq(this.gestureState, State.END)),
      [set(this.isClosing, 1), set(this.openAnimState, 0)]
    ),
    cond(
      eq(this.gestureState, State.ACTIVE),
      [
        set(this.gestureY, neg(divide(this.panY, WINDOW_HEIGHT * 2))),
        set(this.gestureSpringState.time, 0),
        set(this.gestureSpringState.velocity, 0),
        set(this.gestureSpringState.finished, 0)
      ],
      cond(this.isClosing, [
        startClock(this.panClock),
        spring(this.panClock, this.gestureSpringState, {
          ...springConfig,
          toValue: 0
        })
      ])
    ),
    cond(this.gestureSpringState.finished, [
      set(this.isClosing, 0),
      stopClock(this.panClock)
    ]),
    runSpring(this.openAnimState, this.openAnimClock, this.openAnim, 0, 1),
    add(this.openAnim, this.gestureY)
  ]);

  openPlayer = () => {
    this.openAnimState.setValue(1);
  };

  renderMinimizedPlayer() {
    return (
      <Animated.View
        style={[
          styles.minimizedControlsContainer,
          {
            opacity: Animated.interpolate(this.anim, {
              inputRange: [0, 0.2, 1],
              outputRange: [1, 0, 0]
            })
          }
        ]}
      >
        <BorderlessButton
          onPress={this.openPlayer}
          style={styles.minimizedPressContainer}
        >
          <Text
            style={{ paddingHorizontal: 15 }}
            numberOfLines={1}
            style={styles.minimizedTitle}
          >
            Song Title
          </Text>
        </BorderlessButton>
        <TouchableOpacity>
          <Icon name="ios-play" size={35} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon
            style={{ paddingLeft: 15, paddingRight: 30 }}
            name="ios-fastforward"
            size={35}
          />
        </TouchableOpacity>
      </Animated.View>
    );
  }

  renderPlayerOverlay() {
    return (
      <PanGestureHandler
        onGestureEvent={this.handlePan}
        onHandlerStateChange={this.handlePan}
      >
        <Animated.View
          style={[
            styles.playerContainer,
            {
              transform: [
                {
                  translateY: Animated.interpolate(this.anim, {
                    inputRange: [0, 1],
                    outputRange: [
                      WINDOW_HEIGHT - MINIMIZED_HEIGHT - BOTTOM_INSET,
                      0
                    ]
                  })
                }
              ]
            }
          ]}
        >
          {this.renderMinimizedPlayer()}

          {/* Album Art */}
          <Animated.View
            style={[
              styles.artContainer,
              {
                transform: [
                  {
                    translateX: Animated.interpolate(this.anim, {
                      inputRange: [0, 1],
                      outputRange: [-(WINDOW_WIDTH / 2) + ART_SIZE / 2 + 20, 0],
                      extrapolateRight: Extrapolate.CLAMP
                    })
                  },
                  {
                    translateY: Animated.interpolate(this.anim, {
                      inputRange: [0, 1],
                      outputRange: [ART_MINIMIZED_TOP - ART_MAXIMIZED_TOP, 0],
                      extrapolateRight: Extrapolate.CLAMP
                    })
                  },
                  { translateX: -(ART_SIZE / 2) },
                  { translateY: -(ART_SIZE / 2) },
                  {
                    scale: Animated.interpolate(this.anim, {
                      inputRange: [0, 1],
                      outputRange: [ART_MINIMIZED_SIZE / ART_SIZE, 1],
                      extrapolateRight: Extrapolate.CLAMP
                    })
                  },
                  { translateX: ART_SIZE / 2 },
                  { translateY: ART_SIZE / 2 }
                ]
              }
            ]}
          >
            <View style={[styles.art]}>
              <Image style={styles.artImg} source={albumSource} />
            </View>
          </Animated.View>

          {/* Maximized Controls */}
          <View style={[styles.controlsContainer]}>
            <Controls />
          </View>
        </Animated.View>
      </PanGestureHandler>
    );
  }

  render() {
    const { children, style } = this.props;
    return (
      <View style={[styles.container, style]}>
        {children}

        <Animated.View
          style={[
            styles.backgroundDim,
            {
              opacity: Animated.interpolate(this.anim, {
                inputRange: [0, 1],
                outputRange: [0, 0.5]
              })
            }
          ]}
        />

        {this.renderPlayerOverlay()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee"
  },
  playerContainer: {
    ...StyleSheet.absoluteFillObject,
    height: "200%",
    backgroundColor: "#fff",
    overflow: "hidden",
    borderTopColor: "lightgrey",
    borderTopWidth: 1
  },
  backgroundDim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
    opacity: 0
  },
  artContainer: {
    width: "100%",
    height: ART_SIZE,
    alignItems: "center",
    marginTop: ART_MAXIMIZED_TOP
  },
  art: {
    width: ART_SIZE,
    height: ART_SIZE,
    shadowOpacity: 0.3,
    shadowRadius: 50,
    shadowOffset: { width: 0, height: 10 },
    shadowColor: "black",
    borderRadius: 10
  },
  artImg: {
    flex: 1,
    borderRadius: 10
  },
  minimizedControlsContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    height: MINIMIZED_HEIGHT
  },
  minimizedPressContainer: {
    paddingLeft: ART_MINIMIZED_SIZE + 40,
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "flex-start"
  },
  controlsContainer: {},
  minimizedTitle: {
    fontSize: 16
  }
});

export default Player;

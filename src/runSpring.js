import Animated from "react-native-reanimated";

import config from "./springConfig";

const {
  Value,
  clockRunning,
  stopClock,
  cond,
  or,
  set,
  startClock,
  spring,
  block,
  eq,
  diff,
  neq,
  debug,
  onChange,
  and
} = Animated;

export default (animState, clock, translation, activeDest, inactiveDest) => {
  const state = {
    finished: new Animated.Value(0),
    velocity: new Animated.Value(0),
    position: translation,
    time: new Animated.Value(0)
  };

  const activeConfig = { ...config, toValue: activeDest };
  const inactiveConfig = { ...config, toValue: inactiveDest };

  return block([
    onChange(animState, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.velocity, 0),
      startClock(clock)
    ]),
    cond(
      and(eq(animState, 0)),
      [spring(clock, state, activeConfig)],
      [spring(clock, state, inactiveConfig)]
    ),
    state.position
  ]);
};

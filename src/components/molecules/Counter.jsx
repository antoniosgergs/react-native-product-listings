import {Pressable, StyleSheet, Text, View} from 'react-native';
import {normalize} from '../../utils/responsive';

const Counter = ({onDecreaseCount,count,onIncrementCount}) => {
  return (
    <View style={styles.container}>
      <Pressable onPress={onDecreaseCount}>
        <Text style={styles.text}>-</Text>
      </Pressable>
      <Text style={styles.text}>{count}</Text>
      <Pressable onPress={onIncrementCount}>
        <Text style={styles.text}>+</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: normalize(11),
  },
  text: {
    fontWeight: 'bold',
    fontSize: normalize(20),
    paddingHorizontal: normalize(11),
  },
});

export default Counter;

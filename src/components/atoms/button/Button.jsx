import {ActivityIndicator, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {normalize} from '../../../utils/responsive';
import {useTheme} from '../../../context/ThemeContext';

const Button = ({onPress, isLoading, children}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} disabled={isLoading} style={[styles.container, {backgroundColor: colors.buttonBackground}]}>
      {isLoading ? <ActivityIndicator /> : <Text style={styles.text}>{children}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: normalize(6),
    borderRadius: normalize(5),
  },
  text:{
    fontSize: normalize(17),
  },
});


export default Button;

import ProductListScreen from '../screens/ProductListScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text, TouchableOpacity} from 'react-native';
import UserProfile from '../screens/UserProfile';

const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen
      component={ProductListScreen}
      name={'Products'}
      options={({ navigation }) => ({
        title:"Products",
        headerRight: () => (
          <TouchableOpacity
            style={{ paddingRight: 15 }}
            onPress={() => {
              navigation.navigate('AddNewProduct')
            }}
          >
            <Text style={{ color: '#007bff', fontSize: 16 }}>Add new product</Text>
          </TouchableOpacity>
        ),
      })}
    />
    <Tab.Screen
      component={UserProfile}
      name={'UserProfile'}
      options={() => ({title:"User profile"})}
    />
  </Tab.Navigator>
);

export default TabNavigator;

import ProductListScreen from '../screens/ProductListScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {TouchableOpacity} from 'react-native';
import UserProfile from '../screens/UserProfile';
import ShoppingCart from '../screens/ShoppingCart';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Products') {
          iconName = focused ? 'list' : 'list-outline';
        } else if (route.name === 'UserProfile') {
          iconName = focused ? 'person' : 'person-outline';
        } else if (route.name === 'ShoppingCart') {
          iconName = focused ? 'cart' : 'cart-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#007bff',
      tabBarInactiveTintColor: 'gray',
    })}
  >
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
            <Ionicons name={'add-circle-outline'} size={36} />
          </TouchableOpacity>
        ),
      })}
    />
    <Tab.Screen
      component={ShoppingCart}
      name={'ShoppingCart'}
      options={() => ({title:"Shopping cart"})}
    />
    <Tab.Screen
      component={UserProfile}
      name={'UserProfile'}
      options={() => ({title:"User profile"})}
    />
  </Tab.Navigator>
);

export default TabNavigator;

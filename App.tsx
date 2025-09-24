/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */



import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './assignHome/Home';
import Assignment1 from './assign1/Assignment1';
import Assignment2 from './assign2/Assignment2';
import Assignment3 from './assign3/Assignment3';
import Assignment4 from './assign4/Assignment4';
import Assignment5 from './assign5/Assignment5';
import Assignment6 from './assign6/Assignment6';
import CategoryScreen from './assign6/CategoryScreen';
import AddExpense from './assign5/AddExpense';
import PieChartScreen from './assign5/PieChartScreen';


export type Category = {
  name: string;
  isSelected: boolean;
};

 export type stackScreens = 
    { Home:undefined; 
      Assignment1:undefined;
      Assignment2: undefined;
      Assignment3: undefined;
      Assignment4: undefined;
      Assignment5: undefined;
      Assignment6: undefined;
      AddExpense: undefined;
  PieChartScreen: undefined;
      Category: {
    categories: Category[];
    onReturn: (selected: Category[]) => void;
  };
};

const Stack = createNativeStackNavigator<stackScreens>();

function App() {
    return (
    // <View>
    //   <Assignment1 />
    // </View>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Assignment1" component={Assignment1} options={{ title: 'News render App' }} />
        <Stack.Screen name="Assignment2" component={Assignment2} options={{ title: 'Secure Login' }} />
        <Stack.Screen name="Assignment3" component={Assignment3} options={{ title: 'Weather Dashboard App' }} />
        <Stack.Screen name="Assignment4" component={Assignment4} options={{ title: 'Product List' }} />
        <Stack.Screen name="Assignment5" component={Assignment5} options={{ title: 'Expense Tracker' }} />
        <Stack.Screen name="Assignment6" component={Assignment6} options={{ title: 'User Profile' }} />
        <Stack.Screen name="Category" component={CategoryScreen} options={{ title: 'Select Categories' }} />
        <Stack.Screen name='AddExpense' component={AddExpense} options={{ title: 'AddExpense Example' }} />
        <Stack.Screen name='PieChartScreen' component={PieChartScreen} options={{ title: 'PieChart Example' }}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

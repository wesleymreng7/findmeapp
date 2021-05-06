import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import Auth from './Auth'
import OrderService from './OrderService'


const Stack = createStackNavigator()

const Screens = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Auth'>
                <Stack.Screen component={Auth} name='Auth' options={{
                    headerShown: false
                }} />
                <Stack.Screen component={OrderService} name='OrderService' options={{
                    headerShown: false
                }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}


export default Screens
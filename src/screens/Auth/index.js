import React, { useEffect, useState } from 'react'
import { AsyncStorage } from 'react-native'
import { View, Icon, Button, Left, Body, Right, Header, Container, Title, Text, Content, Form, Item, Textarea, Input } from 'native-base'
import { StyleSheet } from 'react-native'
import { login as signin } from '../../api'

const Auth = (props) => {
    const [data, setData] = useState({
        email: '',
        password: ''
    })

    const getToken = async () => {
        try {
            const token = await AsyncStorage.getItem('token')
            if(token) {
                props.navigation.navigate('OrderService')
            }
          } catch (error) {
            
          }
    }

    const login = async () => {
        
        try {
            const responseLogin = await signin(data)
            await AsyncStorage.setItem(
              'token',
              responseLogin.data
            )
            props.navigation.navigate('OrderService')
          } catch (error) {
            alert('Crendeciais inválidas')
          }
    }


    const handleInputChange = (text, field) => {
        const newData = { ...data, [field]: text }
        setData(newData)
    }
    
    useEffect(() => {
        getToken()
    },[])

    return (
        <Container>
            <Content>
                <Form>
                    <Item>
                        <Input placeholder="E-mail" onChangeText={(value) => handleInputChange(value, 'email')} keyboardType='email-address' />
                    </Item>
                    <Item last>
                        <Input placeholder="Senha"  onChangeText={(value) => handleInputChange(value, 'password')} secureTextEntry />
                    </Item>
                </Form>
                <Button style={styles.loginButton} onPress={login} full rounded><Text>Login</Text></Button>
            </Content>

        </Container>
    )
}

const styles = StyleSheet.create({
    loginButton: {
        marginHorizontal: 10,
        marginTop: 10
    }
})

export default Auth
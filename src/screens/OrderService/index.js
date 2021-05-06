import React, { useEffect, useState } from 'react'
import { View, Icon, Button, Left, Body, Right, Header, Container, Title, Text, Content, Form, Item, Textarea, Input } from 'native-base'
import { AsyncStorage, Platform, PermissionsAndroid } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { StyleSheet } from 'react-native'
import { getClients, sendOS as createOS } from '../../api'
import Geolocation from '@react-native-community/geolocation'

const OrderService = (props) => {

    const [description, setDescription] = useState('')
    const [latLng, setLatLng] = useState();
    const [watchID, setWatchID] = useState(0);

    const [clients, setClients] = useState([{ name: '', id: '' }])
    const [selected, setSelected] = useState()

    const retrieveClients = async () => {

        const responseClients = await getClients()
        if (responseClients && responseClients.status === 200) {
            setClients(responseClients.data)
            console.log(responseClients)
        }

    }


    const renderClients = (client, i) => {
        return (
            <Picker.Item label={client.name} value={client.id} key={i} />
        )
    }

    const callLocation = () => {
        if (Platform.OS === 'ios') {
            getLocation();
        } else {
            const requestLocationPermission = async () => {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: "Permissão de Acesso à Localização",
                        message: "Este aplicativo precisa acessar sua localização.",
                        buttonNeutral: "Pergunte-me depois",
                        buttonNegative: "Cancelar",
                        buttonPositive: "OK"
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    getLocation();
                } else {
                    alert('Permissão de Localização negada');
                }
            };
            requestLocationPermission();
        }
    }

    const getLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                const currentLatitude = JSON.stringify(position.coords.latitude);
                const currentLongitude = JSON.stringify(position.coords.longitude);
                setLatLng(`${currentLatitude}|${currentLongitude}`)
                console.log(currentLongitude, currentLatitude)
            },
            (error) => alert(error.message),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    }

    const sendOS = async () => {
        const responseOs = await createOS({
            description,
            clientId: selected,
            location: latLng
        })
        if (responseOs && responseOs.status === 200) {
            setDescription('')
            setSelected('')
            alert('OS enviada com sucesso')
        } else {
            alert('Erro')
        }
    }


    const logout = async () => {
        try {
            await AsyncStorage.removeItem(
                'token'
            );
            props.navigation.navigate('Auth')
        } catch (error) {

        }
    }



    useEffect(() => {
        retrieveClients()
        callLocation()
    }, [])


    return (
        <Container>
            <Content>
                <Form>
                    <Item>
                        <Textarea style={{ width: '100%' }} rowSpan={5} value={description} bordered placeholder="Descrição" onChangeText={(value) => setDescription(value)} />
                    </Item>
                    <Picker
                        mode="dropdown"
                        iosHeader="Selecione o Cliente"
                        iosIcon={<Icon name="arrow-down" />}
                        style={{ width: undefined }}
                        selectedValue={selected}
                        onValueChange={(value) => setSelected(value)}
                    >
                        <Picker.Item label='Selecione um cliente' value='' />
                        {clients.map(renderClients)}
                    </Picker>
                </Form>
                <Button style={styles.sendButton} onPress={sendOS} full rounded><Text>Enviar OS</Text></Button>
                <Button style={styles.sendButton} onPress={logout} full rounded><Text>Sair</Text></Button>
            </Content>

        </Container>
    )
}

const styles = StyleSheet.create({
    sendButton: {
        marginHorizontal: 10,
        marginTop: 10
    }
})

export default OrderService
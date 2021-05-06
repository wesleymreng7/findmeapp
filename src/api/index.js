const baseUrl = 'http://10.0.2.2:3001/v1/'
import axios from 'axios'
import { AsyncStorage } from 'react-native'

const requests = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
})


export const login = async (data) => {
    try {
        const response = await requests.post('contributors/login', data)
        return response.data
    } catch (error) {
        if (error.response) return error.response.data
    }
}

export const getClients = async () => {
    try {
        const response = await requests.get('clients')
        return response.data
    } catch (error) {
        if (error.response) return error.response.data
    }
}

export const sendOS = async (data) => {
    try {
        const token = await AsyncStorage.getItem('token')
        const response = await requests.post('order-services', data, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: token
            }
        })
        return response.data
    } catch (error) {
        if (error.response) return error.response.data
    }
}


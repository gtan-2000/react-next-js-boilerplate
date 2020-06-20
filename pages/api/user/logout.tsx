
import { handleResponse, handleErrorResponse } from "../../../functions/api/apiHandleResponse"
import axios, { AxiosResponse } from 'axios'

import Response from "../../../classes/response/Response"
import { Status } from "../../../classes/response/Status"

export default async (req, res) => {
    const key = req.headers.secret

    try {
        let response = await mockLogout(key) 
        handleResponse(response, res)
    } catch (error) {
        res.status(400).body(new Response('ERROR', error, null))
    }
}

const logout = async (secret: string): Promise<Response<string>> => {
    const url = 'https://truly-yours.com/logout'
    let token = secret.replace(/"/g,'')
    let dataResponse: Response<string>
    let response: AxiosResponse
    
    try {
        response = await axios({
            url: url,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}` 
            }
        })

        dataResponse = response.data
    } catch(error) {
        dataResponse = handleErrorResponse(error)
    }

    return dataResponse
}

const mockLogout = async (userToken: String): Promise<Response<string>>  => {
    let token = process.env.STATIC_TOKEN
    console.log(token, userToken )

    if (token == userToken) {
        return new Response<string>(Status.SUCCESS, 'logout successfull', 'token-forever-143')
    } else {
        return new Response<string>(Status.FAILED, 'logout failure', null)
    }
}
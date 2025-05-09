import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { getToken } from '../../(helpers)'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function POST(request: NextRequest) {
    try {
        const reqToken = await getToken(request)
        console.log('Token from request:', reqToken);

        const config = { headers: { authorization: `Bearer ${reqToken}` } }
        const res = await axios.post(`${API_URL}/api/user/verify`, {}, config)
        console.log('API response:', res.data);

        const verified = res.data
        const { token } = verified

        // Use NextResponse to set cookies in the response
        const response = NextResponse.json(verified)
        response.headers.append('Set-Cookie', `token=${token}; HttpOnly; Secure; SameSite=None; Max-Age=${3600 * 24 * 30}; Path=/`)

        return response
    } catch (err: any) {
        console.error('Next API Error:', {
            message: err.message,
            stack: err.stack,
            response: err.response?.data,
            status: err.response?.status,
            headers: err.response?.headers,
        })
        return NextResponse.json({ error: err.message }, { status: err.status || 401 })
    }
}

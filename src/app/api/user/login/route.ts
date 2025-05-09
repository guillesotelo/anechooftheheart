import { NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: Request) {
    try {
        const user = await request.json();
        const res = await axios.post(`${API_URL}/api/user/login`, user);
        const finalUser = res.data;
        const { token } = finalUser;

        console.log('Attempting to set cookie with token:', token.substring(0, 10) + '...'); // Log part of the token

        // Create the Set-Cookie header manually
        const response = NextResponse.json(finalUser, { status: 200 });

        response.headers.append(
            'Set-Cookie',
            `token=${token}; HttpOnly; Secure; SameSite=None; Max-Age=${3600 * 24 * 30}; Path=/`
        );

        return response;
    } catch (err: any) {
        console.error('Error setting cookie:', err);
        return NextResponse.json({ error: err.code }, { status: err.status || 500 });
    }
}

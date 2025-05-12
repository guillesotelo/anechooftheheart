import { NextResponse } from 'next/server'

export async function POST() {
    try {
        // Create the response
        const response = NextResponse.json(true)

        // Append the Set-Cookie header to delete the cookie
        response.headers.append(
            'Set-Cookie',
            `token=; HttpOnly; Secure; SameSite=None; Max-Age=0; Path=/`
        )

        return response
    } catch (err: any) {
        console.error('Next API Error: ', err)
        return NextResponse.json({ error: err.message }, { status: err.status || 500 })
    }
}
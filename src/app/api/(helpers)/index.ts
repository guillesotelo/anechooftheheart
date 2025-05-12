import { NextRequest, NextResponse } from "next/server";

export const getToken = async (request: NextRequest) => {
    try {
        const cookieToken = (request.headers.get('cookie') || '')
            .split('; ').find(row => row.startsWith('token='))?.split('=')[1] || ''
        const bearerToken = (request.headers.get('authorization') || '')
            .split(' ')[1] || ''
        const paramToken = request.method === 'GET' ? request.nextUrl.searchParams.get('token') : ''
        return cookieToken || bearerToken ||  paramToken || ''
    } catch (err: any) {
        console.error('Next API Error [getToken]: ', err)
        return NextResponse.json({ error: err.message }, { status: err.status || 500 })
    }
}
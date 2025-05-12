import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { retryWithDelay } from 'src/helpers'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
export async function POST(request: NextRequest) {
    try {
        const data = await request.json()
        const res = await retryWithDelay(() => axios.post(`${API_URL}/api/app/updateSubscription`, data), 5, 100)
        return NextResponse.json(res.data)
    } catch (err: any) {
        console.error("Next API Error: ", err)
        return NextResponse.json({ error: err.code }, { status: err.status })
    }
}
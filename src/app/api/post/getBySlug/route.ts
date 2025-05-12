import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { retryWithDelay } from 'src/helpers'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
export async function GET(request: NextRequest) {
    const slug = request.nextUrl.searchParams.get('slug')
    try {
        const res = await retryWithDelay(() => axios.get(`${API_URL}/api/post/getBySlug`, { params: { slug } }), 5, 100)
        return NextResponse.json(res.data)
    } catch (err: any) {
        console.error("Next API Error: ", err)
        return NextResponse.json({ error: err.code }, { status: err.status })
    }
}
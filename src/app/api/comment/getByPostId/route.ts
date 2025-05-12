export const dynamic = 'force-dynamic' // Force dynamic rendering for this route

import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { retryWithDelay } from 'src/helpers'
import { getToken } from '../../(helpers)'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
export async function GET(request: NextRequest) {
    try {
        const token = await getToken(request)
        const headers = { authorization: `Bearer ${token}` }
        const postId = request.nextUrl.searchParams.get('postId')
        const res = await retryWithDelay(() => axios.get(`${API_URL}/api/comment/getByPostId`, { params: { postId }, headers }), 5, 100)
        
        return NextResponse.json(res.data)
    } catch (err: any) {
        console.error("Next API Error: ", err)
        return NextResponse.json({ error: err.code }, { status: err.status })
    }
}
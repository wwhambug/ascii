import { NextResponse } from 'next/server';
import ytdl from 'ytdl-core';

export const dynamic = 'force-dynamic'; // 캐싱 방지
export const maxDuration = 60; // Vercel 타임아웃 연장

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url || !ytdl.validateURL(url)) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  try {
    // ASCII 변환용이므로 가장 낮은 화질(속도 최적화)
    const stream = ytdl(url, {
      quality: 'lowest',
      filter: 'audioandvideo',
    });

    // Node Stream을 Web Stream으로 변환하여 반환
    const readable = new ReadableStream({
      start(controller) {
        stream.on('data', chunk => controller.enqueue(chunk));
        stream.on('end', () => controller.close());
        stream.on('error', err => controller.error(err));
      },
    });

    return new NextResponse(readable, {
      headers: { 'Content-Type': 'video/mp4' },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch video' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core'; // 여기가 핵심 수정 사항입니다!

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url || !ytdl.validateURL(url)) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  try {
    const stream = ytdl(url, {
      quality: 'lowest',
      filter: 'audioandvideo',
    });

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

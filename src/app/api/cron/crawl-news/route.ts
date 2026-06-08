import { NextResponse } from 'next/server';
import axios from 'axios';
import { JSDOM } from 'jsdom';

// Note: This function needs to be adapted from the existing scripts/crawlers/news_crawler.ts
// logic to work within a Next.js API route context.
async function crawlNews() {
  const url = 'https://cafef.vn/thi-truong-chung-khoan.chn';
  
  const response = await axios.get<string>(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  });

  const dom = new JSDOM(response.data);
  const doc = dom.window.document;
  const articles: any[] = [];
  
  const headings = Array.from(doc.querySelectorAll('h2 a, h3 a')) as HTMLAnchorElement[];
  
  for (const anchor of headings) {
    const title = anchor.textContent?.trim() || '';
    if (title.length < 10) continue;
    
    const href = anchor.getAttribute('href') || '';
    const articleUrl = href.startsWith('http') ? href : `https://cafef.vn${href}`;
    
    articles.push({
      title,
      url: articleUrl,
      source: 'CafeF',
      publishedAt: new Date(),
      language: 'vi',
    });
    
    if (articles.length >= 5) break; // Keep it light for serverless timeout
  }

  // In a real scenario, you'd likely save to a DB instead of calling another API
  // or use an internal function to process.
  console.log(`Found ${articles.length} articles.`);
  return articles;
}

export async function GET(req: Request) {
  // 1. Security: Ensure the request comes from Vercel Cron
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const articles = await crawlNews();
    // Process/Save articles here...
    return NextResponse.json({ success: true, count: articles.length });
  } catch (error) {
    console.error('Cron job failed:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

import axios from 'axios';
import { JSDOM } from 'jsdom';
import * as dotenv from 'dotenv';
import path from 'path';

// Load backend env to get API URL if needed, or fallback to default
dotenv.config({ path: path.resolve(__dirname, '../../ameizin-be/.env') });

const API_URL = process.env.BACKEND_API_URL || 'http://localhost:3001/api/news/admin/news/import';

async function crawlCafeFNews() {
  console.log('Crawling CafeF...');
  const url = 'https://cafef.vn/thi-truong-chung-khoan.chn';

  const response = await axios.get<string>(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'vi-VN,vi;q=0.9',
    },
  });

  const dom = new JSDOM(response.data);
  const doc = dom.window.document;

  const articles: Array<{
    title: string;
    sapo: string;
    url: string;
    source: string;
    publishedAt: Date;
    language: 'vi';
  }> = [];

  // CafeF renders articles as <h2> and <h3> headings with <a> inside
  const headings = Array.from(doc.querySelectorAll('h2 a, h3 a')) as HTMLAnchorElement[];

  for (const anchor of headings) {
    const title = anchor.textContent?.trim() || '';
    if (title.length < 10) continue;

    const href = anchor.getAttribute('href') || '';
    const articleUrl = href.startsWith('http') ? href : `https://cafef.vn${href}`;

    // Sapo: look for adjacent paragraph after the heading
    const heading = anchor.closest('h2, h3');
    let sapo = '';

    if (heading) {
      // Try next sibling <p> or any text node nearby
      let next = heading.nextElementSibling;
      while (next && !sapo) {
        const text = next.textContent?.trim() || '';
        if (text.length > 20 && !next.querySelector('h1,h2,h3,h4')) {
          sapo = text;
        }
        next = next.nextElementSibling;
      }

      // Fallback: check parent container for a <p>
      if (!sapo) {
        const parent = heading.parentElement;
        const p = parent?.querySelector('p');
        sapo = p?.textContent?.trim() || '';
      }
    }

    if (!sapo || sapo.length < 20) {
      sapo = title; // Use title as fallback sapo
    }

    articles.push({
      title,
      sapo,
      url: articleUrl,
      source: 'CafeF',
      publishedAt: new Date(),
      language: 'vi',
    });

    if (articles.length >= 10) break;
  }

  console.log(`Found ${articles.length} articles.`);
  articles.forEach((a, i) => console.log(`  [${i + 1}] ${a.title.substring(0, 80)}`));

  if (articles.length > 0) {
    try {
      await axios.post(API_URL, {
        articles,
        provider: 'gemini',
        enrichImmediately: true,
      });
      console.log('✅ Articles sent for enrichment.');
    } catch (error) {
      console.error('❌ Failed to send articles to backend:', error);
    }
  } else {
    console.log('⚠️  No articles found. The page structure may have changed.');
  }
}

crawlCafeFNews().catch(console.error);

import axios from 'axios';
import { JSDOM } from 'jsdom';
import * as dotenv from 'dotenv';
// Adjusted paths to reach backend
import { connectDB, disconnectDB } from '../../ameizin-be/src/config/database';
import enrichmentService from '../../ameizin-be/src/services/enrichment.service';
import NewsArticleModel from '../../ameizin-be/src/db/models/news';

dotenv.config({ path: '../../ameizin-be/.env' });

export class CrawlerService {
  async run() {
    console.log('[Crawler] Starting scheduled crawl...');
    try {
      await connectDB();
      // Example: Crawl CafeF
      const articles = await this.crawlCafeF();
      
      for (const rawArticle of articles) {
        const existing = await NewsArticleModel.findOne({ url: rawArticle.url });
        if (existing) continue;

        const enriched = await enrichmentService.enrichArticle(rawArticle, 'gemini');
        const newsArticle = new NewsArticleModel({
          ...enriched,
          crawledAt: new Date(),
          enrichedAt: new Date(),
          sourceAttribution: rawArticle.url,
        });
        await newsArticle.save();
        console.log(`[Crawler] Saved: ${rawArticle.title}`);
      }
      console.log('[Crawler] Crawl completed successfully.');
      await disconnectDB();
    } catch (error) {
      console.error('[Crawler] Error during crawl:', error);
      process.exit(1);
    }
  }

  private async crawlCafeF() {
    const url = 'https://cafef.vn/thi-truong-chung-khoan.chn';
    const response = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
    });
    const dom = new JSDOM(response.data);
    const doc = dom.window.document;

    return Array.from(doc.querySelectorAll('.tlitem')).slice(0, 5).map(el => ({
      title: el.querySelector('.tlitem-title')?.textContent?.trim() || '',
      sapo: el.querySelector('.tlitem-sapo')?.textContent?.trim() || 'No sapo available',
      url: 'https://cafef.vn' + (el.querySelector('a')?.getAttribute('href') || ''),
      source: 'CafeF',
      publishedAt: new Date(),
      language: 'vi' as const,
    })).filter(a => a.title.length > 10 && a.sapo.length > 20);
  }
}

const crawler = new CrawlerService();
if (require.main === module) {
  crawler.run();
}

export default crawler;

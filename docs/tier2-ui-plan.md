# Tier 2 — Kế hoạch bổ sung UI nâng cao

> Tài liệu phân tích và lên kế hoạch chi tiết cho các component UI Tier 2.
> Tham khảo domain knowledge từ [vnstock](https://github.com/thinh-vu/vnstock).
> Chỉ implement khi được approve.

---

## Tổng quan

Tier 2 gồm 3 nhóm tính năng cần thêm **data source mới** hoặc **crawl endpoint mới** — không thể tính từ data hiện có. Mỗi mục dưới đây bao gồm: mô tả, data cần crawl, UI mockup, và effort estimate.

---

## D. Gold & USD/VND Widget

### Mô tả
Widget nhỏ hiển thị giá vàng SJC và tỷ giá USD/VND — hai chỉ số mà nhà đầu tư VN theo dõi hàng ngày bên cạnh chứng khoán.

### Data cần crawl
| Dữ liệu | Nguồn | Endpoint | Tần suất |
|----------|-------|----------|----------|
| Giá vàng SJC | SJC hoặc BTMC | Cần khảo sát API (có thể scrape trang SJC) | 2 lần/ngày |
| Tỷ giá USD/VND | Vietcombank hoặc NHNN | VCB có API JSON public | 2 lần/ngày |

### Vị trí UI
- Đặt trên Header hoặc ngay dưới Header dạng **ticker strip** (thanh ngang cuộn):
  ```
  ┌──────────────────────────────────────────────────────────┐
  │  Vàng SJC: 92.500  (+200)  |  USD/VND: 25.450  (-10)   │
  └──────────────────────────────────────────────────────────┘
  ```
- Hoặc dạng 2 Card nhỏ trong sidebar (nếu sau này có sidebar).

### File cần tạo/sửa
- `scripts/crawl-gold-fx.ts` — Script crawl riêng (hoặc thêm vào `crawl.ts`)
- `public/data/gold-price.json` — `{ sjc: { buy, sell }, updatedAt }`
- `public/data/exchange-rate.json` — `{ usdVnd: { buy, sell }, updatedAt }`
- `src/components/ui/GoldFxStrip.tsx` — Component hiển thị
- `src/services/providers/static-data.ts` — Thêm fetch functions
- `.github/workflows/crawl.yml` — Thêm bước crawl (hoặc workflow riêng)

### Effort estimate
- Khảo sát API: 1-2 giờ (tìm nguồn ổn định, test response)
- Crawl script: 1 giờ
- UI component: 1 giờ
- **Tổng: ~4 giờ**

### Rủi ro
- API giá vàng không ổn định (nhiều nguồn dùng scraping, dễ bị block)
- Cần tìm nguồn có JSON API, không chỉ HTML page

---

## E. Sector Heatmap

### Mô tả
Bản đồ nhiệt (treemap) hiển thị tất cả cổ phiếu được nhóm theo ngành (ICB classification), tô màu theo mức thay đổi giá trong ngày, kích thước ô theo vốn hóa. Tương tự finviz.com — một trong những visualization ấn tượng nhất cho stock dashboard.

### Data cần crawl
| Dữ liệu | Nguồn | Chi tiết | Tần suất |
|----------|-------|----------|----------|
| Phân ngành ICB | VCI (Viet Capital) | 4 cấp: sector → subsector → industry → subindustry | 1 lần/tháng |
| Giá tất cả mã HOSE | KBS API | ~400 mã, dùng endpoint hiện tại | Mỗi 15 phút (giờ GD) |
| Vốn hóa thị trường | KBS hoặc VCI | Để xác định kích thước ô | 1 lần/ngày |

### Vị trí UI
- Trang riêng `/heatmap` hoặc tab trên trang chủ
- Responsive: treemap trên desktop, list view trên mobile
  ```
  ┌─────────────────────────────────────────────┐
  │  Ngân hàng          │  Bất động sản         │
  │ ┌─────┬───┬──┐      │ ┌──────┬────┐         │
  │ │ VCB │TCB│MB│      │ │ VHM  │VIC │         │
  │ │+1.2%│-.8│+.│      │ │+2.1% │+6% │         │
  │ └─────┴───┴──┘      │ └──────┴────┘         │
  │─────────────────────│───────────────────────│
  │  Thép & Vật liệu    │  Công nghệ            │
  │ ┌──────────┐        │ ┌──────────┐          │
  │ │   HPG    │        │ │   FPT    │          │
  │ │  +1.6%   │        │ │  +2.5%   │          │
  │ └──────────┘        │ └──────────┘          │
  └─────────────────────────────────────────────┘
  ```

### File cần tạo/sửa
- `scripts/crawl.ts` — Mở rộng: crawl toàn bộ HOSE (~400 mã) thay vì chỉ 20 mã
- `scripts/crawl-sectors.ts` — Crawl phân ngành ICB từ VCI
- `public/data/sectors.json` — `{ sectors: [{ name, code, stocks: [...] }] }`
- `public/data/all-stock-prices.json` — Giá tất cả mã (thay vì chỉ 20)
- `src/features/heatmap/index.tsx` — Trang heatmap chính
- `src/features/heatmap/components/SectorTreemap.tsx` — Recharts Treemap hoặc D3
- `src/app/heatmap/page.tsx` — Route page

### Thư viện bổ sung
- Recharts đã có sẵn, hỗ trợ `Treemap` component
- Hoặc dùng `d3-hierarchy` + custom SVG nếu cần kiểm soát nhiều hơn

### Effort estimate
- Khảo sát VCI API + crawl phân ngành: 2 giờ
- Mở rộng crawl toàn bộ HOSE: 2 giờ (cần rate limiting tốt hơn)
- Treemap component: 4-6 giờ (phức tạp nhất)
- Route + integration: 1 giờ
- **Tổng: ~10-12 giờ**

### Rủi ro
- Crawl 400 mã mỗi 15 phút có thể bị rate-limit bởi KBS
- Treemap responsive trên mobile khó đọc — cần fallback view
- File `all-stock-prices.json` sẽ lớn hơn đáng kể

---

## F. Company Profile Tab

### Mô tả
Thêm tab "Giới thiệu" vào trang chi tiết cổ phiếu (`/stock/[symbol]`), hiển thị thông tin cơ bản: mô tả công ty, ngành nghề, vốn điều lệ, ngày niêm yết, số nhân viên, ban lãnh đạo, cổ đông lớn.

### Data cần crawl
| Dữ liệu | Nguồn | Chi tiết | Tần suất |
|----------|-------|----------|----------|
| Tổng quan công ty | KBS API | Mô tả, vốn, ngày niêm yết, nhân viên | 1 lần/tuần |
| Ban lãnh đạo | KBS API | Tên, chức vụ | 1 lần/tuần |
| Cổ đông lớn | KBS API | Tên, số CP, tỷ lệ sở hữu | 1 lần/tuần |
| Cơ cấu sở hữu | KBS API | Tổ chức / Cá nhân / Nước ngoài / Nhà nước | 1 lần/tuần |

### Vị trí UI
- Thêm `Tabs` component vào trang stock detail:
  ```
  ┌──────────────────────────────────────────────┐
  │  [Biểu đồ giá]  [Giới thiệu]  [Tài chính]  │
  ├──────────────────────────────────────────────┤
  │                                              │
  │  Tên: Công ty CP Sữa Việt Nam               │
  │  Mã: VNM  |  Sàn: HOSE  |  Ngành: Thực phẩm│
  │  Vốn điều lệ: 17.416 tỷ VND                 │
  │  Ngày niêm yết: 19/01/2006                  │
  │  Số nhân viên: 9.802                         │
  │                                              │
  │  ┌─ Cổ đông lớn ─────────────────────┐      │
  │  │ SCIC              36.00%          │      │
  │  │ F&N Dairy          17.69%          │      │
  │  │ Platinum Victory   10.62%          │      │
  │  └───────────────────────────────────┘      │
  │                                              │
  │  ┌─ Cơ cấu sở hữu (Donut Chart) ───┐      │
  │  │    Tổ chức 65%  |  Cá nhân 22%   │      │
  │  │    Nước ngoài 8% |  Nhà nước 5%  │      │
  │  └───────────────────────────────────┘      │
  │                                              │
  └──────────────────────────────────────────────┘
  ```

### File cần tạo/sửa
- `scripts/crawl-company.ts` — Crawl company profile (chạy weekly)
- `public/data/company-{SYMBOL}.json` — Profile data cho mỗi mã
- `src/features/stock-detail/components/CompanyProfile.tsx` — Tab giới thiệu
- `src/features/stock-detail/components/ShareholderChart.tsx` — Donut chart cổ đông
- `src/features/stock-detail/index.tsx` — Thêm Tabs wrapper
- `src/types/stock.ts` — Thêm interface `CompanyProfile`, `Shareholder`
- `.github/workflows/crawl-weekly.yml` — Workflow crawl hàng tuần

### Thư viện bổ sung
- Recharts `PieChart` cho donut chart (đã có sẵn)

### Effort estimate
- Khảo sát KBS company API: 1-2 giờ
- Crawl script: 2 giờ (20 mã × nhiều endpoint)
- CompanyProfile component: 2 giờ
- ShareholderChart (donut): 1 giờ
- Tabs integration: 1 giờ
- **Tổng: ~7-8 giờ**

### Rủi ro
- KBS có thể không có đủ company info (cần test)
- Data tiếng Việt có thể cần xử lý encoding
- Mỗi mã cần 1 file JSON riêng — 20 files thêm cho company data

---

## Thứ tự ưu tiên đề xuất

| # | Feature | Effort | Impact | Khuyến nghị |
|---|---------|--------|--------|-------------|
| 1 | **F. Company Profile** | ~8h | Cao — thông tin cơ bản mà mọi investor cần | Implement trước |
| 2 | **D. Gold & FX Widget** | ~4h | Trung bình — bổ trợ, không phải core | Implement sau F |
| 3 | **E. Sector Heatmap** | ~12h | Cao nhưng effort lớn | Implement cuối |

### Lý do
- **Company Profile** (F) có impact cao nhất vì mọi nhà đầu tư mới đều cần biết "công ty này làm gì" trước khi ra quyết định. Effort vừa phải.
- **Gold & FX** (D) effort thấp nhất nhưng là tính năng bổ trợ, không phải core.
- **Sector Heatmap** (E) là feature "wow" nhưng effort lớn nhất và cần mở rộng crawl đáng kể.

---

## Checklist trước khi implement

- [ ] Khảo sát và xác nhận API source khả dụng
- [ ] Test response format, rate limit
- [ ] Thiết kế JSON schema cho static data
- [ ] Mockup UI chi tiết hơn (nếu cần)
- [ ] Review và approve plan
- [ ] Implement crawl script + test
- [ ] Implement UI component
- [ ] Integration test với real data
- [ ] Update generateStaticParams nếu thêm route mới

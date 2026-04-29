# THÔNG TIN BUILD WEB TÀI CHÍNH

## Mong muốn

- Hiển thị BCTC (Cân đối kế toán, Kết quả hoạt động kinh doanh, Lưu chuyển tiền tệ) của các công ty trên thị trường.
- Từ BCTC có thể tính được % tăng trưởng qua từng năm, từng quý so với cùng kỳ.

---

## 1. Nhóm Dữ liệu Đầu vào (Data Input)

- **Thông tin hiển thị:** Tên công ty, Mã chứng khoán.
- **Các bảng biểu chính:** Khả năng nhập liệu/tự động hóa bóc tách các mục từ:
  - Báo cáo tình hình tài chính (Bảng cân đối kế toán).
  - Báo cáo kết quả hoạt động kinh doanh.
  - Báo cáo lưu chuyển tiền tệ.
  - Các chỉ tiêu ngoài bảng cân đối kế toán.

---

## 2. Nhóm Hiển thị và Theo dõi

- **Bảng tóm tắt kết quả kinh doanh:** Hiển thị Doanh thu hoạt động, Chi phí hoạt động, Lợi nhuận trước thuế (LNTT) và Lợi nhuận sau thuế (LNST).
- **So sánh cùng kỳ:** Website cần có chức năng so sánh số liệu giữa:
  - Năm nay và Năm trước.
  - Quý này và Quý cùng kỳ năm trước.
  - Kèm theo tỷ lệ phần trăm tăng/giảm (%) để dễ nhận diện biến động.
- **Biểu đồ xu hướng:** Trình bày biến động doanh thu và lợi nhuận qua các quý dưới dạng biểu đồ.

---

## 3. Nhóm Tính toán Chỉ số Tài chính

Lập trình công thức tự động dựa trên dữ liệu đã nhập:

### Chỉ số hiệu quả

- **Biên lợi nhuận ròng:** `LNST / Doanh thu hoạt động`
- **ROA** (Tỷ suất sinh lời trên tài sản): `LNST / Tổng tài sản bình quân`
- **ROE** (Tỷ suất sinh lời trên vốn chủ sở hữu): `LNST / Vốn chủ sở hữu bình quân`

### Chỉ số đặc thù (nếu là ngành tài chính/chứng khoán)

- **Biên lãi ròng (NIM):** Tính dựa trên Thu nhập lãi thuần và Tài sản sinh lời.
- **Chi phí vốn (Cost of Funds):** Tính dựa trên Chi phí lãi vay và Nợ vay chịu lãi.

### Cơ cấu tài sản

- Tỷ lệ các loại tài sản tài chính như **FVTPL**, **HTM**, **AFS** trong tổng tài sản.

### ⚠️ Lưu ý quan trọng

Có 3 điểm khác biệt về bản chất khiến việc dùng chung 1 công thức "cứng" sẽ gây sai số:

1. **Số dư bình quân vs. Số cuối kỳ:** ROA/ROE bắt buộc phải dùng số bình quân `(Đầu kỳ + Cuối kỳ) / 2`, trong khi Biên LN ròng chỉ dùng số phát sinh trong kỳ.
2. **Đặc thù ngành:** Một công ty sản xuất không có tài sản FVTPL hay NIM — nếu dùng chung công thức sẽ trả về kết quả rác hoặc lỗi.
3. **Đơn vị tính:** Các chỉ số cơ cấu tài sản là % trên tổng tài sản, còn các chỉ số hiệu quả là % trên doanh thu hoặc vốn.

> **Lời khuyên:** Nên phân nhóm thành 3 "Block" công thức: **Hiệu quả – Đặc thù – Cơ cấu**.

---

## 4. Ghi chú

> Sau mỗi giao diện cần có phần **GHI CHÚ** để người dùng có thể tự ghi chú những thông tin cần thiết.

---

## 5. Các Tính năng Mở rộng

- **Bộ lọc (Filtering):** Tìm kiếm công ty theo mã, ngành nghề, hoặc theo các tiêu chí tài chính (ví dụ: tìm các công ty có LNST tăng trưởng > 20%).
- **Xuất báo cáo (Export):** Cho phép xuất dữ liệu đã tổng hợp ra file Excel để tự phân tích thêm.
- **Cảnh báo (Alerts):** Thông báo khi có công ty mới công bố BCTC hoặc khi một chỉ số tài chính chạm ngưỡng cảnh báo.

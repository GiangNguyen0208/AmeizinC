import type { GuideNode, GuideContent } from "@/types";

export interface GuideCharacter {
  name: string;
  emoji: string;
  color: string;
  personality: string;
}

export const GUIDE_CHARACTERS: Record<string, GuideCharacter> = {
  teacher: {
    name: "Bác Tài",
    emoji: "\u{1F468}\u{200D}\u{1F3EB}",
    color: "#f59e0b",
    personality: "Kiên nhẫn, dễ hiểu, dành cho người mới",
  },
  analyst: {
    name: "Minh",
    emoji: "\u{1F9D1}\u{200D}\u{1F4BC}",
    color: "#3b82f6",
    personality: "Chuyên gia phân tích, yêu thích dữ liệu",
  },
  trader: {
    name: "Linh",
    emoji: "\u{1F469}\u{200D}\u{1F4BB}",
    color: "#10b981",
    personality: "Nhà giao dịch năng động, thực chiến",
  },
};

export const GUIDE_TREE: GuideNode = {
  id: "root",
  label: "Thị trường chứng khoán Việt Nam",
  icon: "StockOutlined",
  children: [
    {
      id: "indices",
      label: "Chỉ số thị trường",
      icon: "LineChartOutlined",
      children: [
        {
          id: "vnindex",
          label: "VN-Index",
          icon: "RiseOutlined",
          content: {
            characterName: "teacher",
            message:
              "VN-Index là chỉ số đại diện cho toàn bộ cổ phiếu niêm yết trên sàn HOSE (Sở Giao dịch Chứng khoán TP.HCM). Khi VN-Index tăng, nghĩa là phần lớn cổ phiếu trên sàn đang tăng giá — thị trường đang lạc quan. Ngược lại, khi giảm thì thị trường đang bi quan.",
            example:
              "VN-Index tăng từ 1,200 lên 1,250 điểm (+4.2%) nghĩa là trung bình các cổ phiếu trên HOSE đã tăng khoảng 4.2%.",
            relatedSymbols: ["VNINDEX"],
          },
        },
        {
          id: "hnxindex",
          label: "HNX-Index",
          icon: "RiseOutlined",
          content: {
            characterName: "teacher",
            message:
              "HNX-Index đại diện cho sàn Hà Nội (HNX). Sàn này thường có các doanh nghiệp vừa và nhỏ hơn so với HOSE. Biến động của HNX-Index giúp bạn đánh giá sức khỏe của nhóm cổ phiếu mid-cap và small-cap.",
            relatedSymbols: ["HNXINDEX"],
          },
        },
        {
          id: "upcom",
          label: "UPCOM-Index",
          icon: "RiseOutlined",
          content: {
            characterName: "teacher",
            message:
              "UPCOM là sàn dành cho các công ty chưa đủ điều kiện niêm yết trên HOSE hoặc HNX. Thanh khoản thấp hơn nhưng đôi khi có cơ hội tốt khi doanh nghiệp chuẩn bị chuyển sàn lên HOSE.",
            relatedSymbols: ["UPCOMINDEX"],
          },
        },
      ],
    },
    {
      id: "technical",
      label: "Phân tích kỹ thuật",
      icon: "BarChartOutlined",
      children: [
        {
          id: "rsi",
          label: "RSI",
          icon: "DashboardOutlined",
          content: {
            characterName: "analyst",
            message:
              "RSI (Relative Strength Index) đo lường tốc độ và biên độ thay đổi giá gần đây. RSI dao động từ 0 đến 100. Trên 70 là vùng quá mua (có thể sắp giảm), dưới 30 là vùng quá bán (có thể sắp tăng). Đây là một trong những chỉ báo kỹ thuật phổ biến nhất.",
            example:
              "RSI của VNM = 75 → cổ phiếu đang ở vùng quá mua, có thể cân nhắc chốt lời.",
            relatedSymbols: ["VNM"],
          },
        },
        {
          id: "macd",
          label: "MACD",
          icon: "SlidersOutlined",
          content: {
            characterName: "analyst",
            message:
              "MACD (Moving Average Convergence Divergence) dùng 2 đường trung bình động để xác định xu hướng. Khi đường MACD cắt lên trên đường Signal → tín hiệu mua. Khi cắt xuống → tín hiệu bán. Histogram cho biết khoảng cách giữa 2 đường.",
            example:
              "MACD của FPT vừa cắt lên Signal → có thể bắt đầu xu hướng tăng mới.",
            relatedSymbols: ["FPT"],
          },
        },
        {
          id: "ma",
          label: "Đường MA",
          icon: "StockOutlined",
          content: {
            characterName: "analyst",
            message:
              "MA (Moving Average) là đường trung bình giá trong một khoảng thời gian. MA20 = trung bình 20 phiên gần nhất. Khi giá cắt lên MA → xu hướng tăng. MA50 và MA200 là các mốc quan trọng. Khi MA ngắn hạn cắt lên MA dài hạn gọi là Golden Cross — tín hiệu rất tích cực.",
            example:
              "HPG đang giao dịch trên MA200 → xu hướng dài hạn đang tăng.",
            relatedSymbols: ["HPG"],
          },
        },
        {
          id: "volume",
          label: "Khối lượng",
          icon: "BarChartOutlined",
          content: {
            characterName: "trader",
            message:
              "Khối lượng giao dịch (Volume) cho biết số lượng cổ phiếu được mua bán trong phiên. Volume cao + giá tăng = xu hướng mạnh. Volume cao + giá giảm = áp lực bán lớn. Volume thấp = thị trường đang chờ đợi, thiếu quyết đoán.",
            example:
              "VCB tăng giá mạnh kèm volume gấp 3 lần trung bình → tín hiệu xác nhận xu hướng tăng.",
            relatedSymbols: ["VCB"],
          },
        },
      ],
    },
    {
      id: "fundamental",
      label: "Phân tích cơ bản",
      icon: "FundOutlined",
      children: [
        {
          id: "pe",
          label: "P/E",
          icon: "CalculatorOutlined",
          content: {
            characterName: "analyst",
            message:
              "P/E (Price/Earnings) = Giá cổ phiếu / Lợi nhuận trên mỗi cổ phiếu. Cho biết bạn đang trả bao nhiêu cho mỗi đồng lợi nhuận. P/E thấp có thể là cổ phiếu rẻ, P/E cao có thể là kỳ vọng tăng trưởng. So sánh P/E với cùng ngành mới có ý nghĩa.",
            example:
              "VNM có P/E = 15, ngành tiêu dùng trung bình P/E = 20 → VNM đang được định giá hấp dẫn hơn trung bình ngành.",
            relatedSymbols: ["VNM"],
          },
        },
        {
          id: "eps",
          label: "EPS",
          icon: "DollarOutlined",
          content: {
            characterName: "analyst",
            message:
              "EPS (Earnings Per Share) = Lợi nhuận ròng / Tổng số cổ phiếu. Đây là chỉ số quan trọng nhất để đánh giá khả năng sinh lời. EPS tăng đều qua các quý → doanh nghiệp đang tăng trưởng tốt. EPS giảm → cần tìm hiểu nguyên nhân.",
            example:
              "FPT có EPS tăng từ 4,200đ lên 5,100đ (+21%) → lợi nhuận tăng trưởng mạnh.",
            relatedSymbols: ["FPT"],
          },
        },
        {
          id: "roe",
          label: "ROE",
          icon: "PercentageOutlined",
          content: {
            characterName: "analyst",
            message:
              "ROE (Return on Equity) = Lợi nhuận ròng / Vốn chủ sở hữu. Cho biết doanh nghiệp sử dụng vốn của cổ đông hiệu quả đến đâu. ROE > 15% được coi là tốt. ROE quá cao cần kiểm tra xem có phải do vay nợ nhiều không.",
            example:
              "VCB có ROE = 24% → ngân hàng sử dụng vốn rất hiệu quả.",
            relatedSymbols: ["VCB"],
          },
        },
        {
          id: "marketcap",
          label: "Vốn hóa",
          icon: "BankOutlined",
          content: {
            characterName: "teacher",
            message:
              "Vốn hóa thị trường = Giá cổ phiếu × Tổng số cổ phiếu lưu hành. Đây là thước đo quy mô doanh nghiệp. Large-cap (>10,000 tỷ VNĐ) thường ổn định, Mid-cap (1,000-10,000 tỷ) có tiềm năng tăng trưởng, Small-cap (<1,000 tỷ) biến động mạnh hơn.",
            example:
              "VIC có vốn hóa ~150,000 tỷ VNĐ → thuộc nhóm large-cap, thường ít biến động mạnh.",
            relatedSymbols: ["VIC"],
          },
        },
      ],
    },
    {
      id: "trading",
      label: "Giao dịch",
      icon: "SwapOutlined",
      children: [
        {
          id: "orders",
          label: "Lệnh mua/bán",
          icon: "ShoppingCartOutlined",
          content: {
            characterName: "trader",
            message:
              "Có 3 loại lệnh chính: LO (giới hạn, đặt giá cụ thể), ATO (khớp giá mở cửa), ATC (khớp giá đóng cửa). Lệnh LO phổ biến nhất — bạn đặt giá muốn mua/bán, chờ khớp. ATO/ATC dùng khi muốn khớp theo giá thị trường đầu/cuối phiên.",
            example:
              "Đặt lệnh LO mua MBB giá 19,500đ → lệnh chỉ khớp khi có người bán ở giá ≤19,500đ.",
            relatedSymbols: ["MBB"],
          },
        },
        {
          id: "t2",
          label: "T+2",
          icon: "ClockCircleOutlined",
          content: {
            characterName: "trader",
            message:
              "T+2 nghĩa là sau khi mua cổ phiếu, phải chờ 2 ngày làm việc mới được bán. Ví dụ mua thứ 2 → bán được từ thứ 4. Đây là quy định thanh toán bù trừ tại Việt Nam. Đối với chứng khoán phái sinh thì không có quy tắc T+2.",
          },
        },
        {
          id: "margin",
          label: "Margin",
          icon: "ThunderboltOutlined",
          content: {
            characterName: "trader",
            message:
              "Margin là vay tiền từ công ty chứng khoán để mua thêm cổ phiếu. Ví dụ có 100 triệu, margin tỷ lệ 1:1 cho phép mua 200 triệu. Lợi nhuận nhân đôi nhưng thua lỗ cũng nhân đôi. Cẩn thận: khi giá giảm quá mức, bạn sẽ bị call margin (buộc bán).",
            example:
              "Vốn 100tr, margin mua thêm 100tr TCB. TCB giảm 20% → lỗ 40tr (40% vốn thay vì 20%).",
            relatedSymbols: ["TCB"],
          },
        },
        {
          id: "foreign",
          label: "Room ngoại",
          icon: "GlobalOutlined",
          content: {
            characterName: "teacher",
            message:
              "Room ngoại là giới hạn tỷ lệ sở hữu của nhà đầu tư nước ngoài. Khi room đầy, nhà đầu tư ngoại không mua thêm được → giảm cầu. Khi room còn nhiều và ngoại mua ròng → tín hiệu tích cực vì họ thường đầu tư dài hạn.",
            example:
              "MSN còn room ngoại 10%, quỹ ngoại đang mua ròng → dấu hiệu tích cực.",
            relatedSymbols: ["MSN"],
          },
        },
      ],
    },
  ],
};

export function getCharacter(name: string): GuideCharacter {
  return GUIDE_CHARACTERS[name] || GUIDE_CHARACTERS.teacher;
}

export function getAllLeafContents(): { node: GuideNode; content: GuideContent }[] {
  const results: { node: GuideNode; content: GuideContent }[] = [];
  function walk(node: GuideNode) {
    if (node.content) results.push({ node, content: node.content });
    node.children?.forEach(walk);
  }
  walk(GUIDE_TREE);
  return results;
}

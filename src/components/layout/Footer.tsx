import { Typography } from "antd";

const { Text } = Typography;

export function Footer() {
  return (
    <footer className="border-t border-gray-700 bg-gray-900 px-6 py-4 mt-auto">
      <div className="max-w-7xl mx-auto text-center">
        <Text type="secondary">
          Ameizin &copy; {new Date().getFullYear()} — Dữ liệu tài chính Việt Nam
        </Text>
      </div>
    </footer>
  );
}

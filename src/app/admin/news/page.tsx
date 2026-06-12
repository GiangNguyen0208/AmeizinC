"use client";

import { useState } from "react";
import { Button, Card, Typography, message } from "antd";
import axios from "axios";

const { Title } = Typography;

export default function AdminNewsManagement() {
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    setLoading(true);
    try {
      // Mocked import for now
      await axios.post('http://localhost:3001/api/news/admin/news/import', {
        articles: [], // Add articles here
        enrichImmediately: true
      });
      message.success("Import triggered");
    } catch (err) {
      console.error(err);
      message.error("Import failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Title level={2} style={{ color: "#fff" }}>Admin News Management</Title>
      <Card>
        <Button type="primary" onClick={handleImport} loading={loading}>
          Import News
        </Button>
      </Card>
    </div>
  );
}

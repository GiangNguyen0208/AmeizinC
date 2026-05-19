"use client";

import { useEffect, useState, useCallback } from "react";
import { Tag, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import type { GuideContent } from "@/types";
import { getCharacter } from "../data/guide-content";

interface Props {
  content: GuideContent;
  onClose: () => void;
}

function useTypingAnimation(message: string, speed = 20) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [prevMessage, setPrevMessage] = useState(message);

  if (prevMessage !== message) {
    setPrevMessage(message);
    setDisplayedText("");
    setIsTyping(true);
  }

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedText(message.slice(0, i));
      if (i >= message.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [message, speed]);

  const skip = useCallback(() => {
    setDisplayedText(message);
    setIsTyping(false);
  }, [message]);

  return { displayedText, isTyping, skip };
}

export function GuideCharacter({ content, onClose }: Props) {
  const character = getCharacter(content.characterName);
  const { displayedText, isTyping, skip: skipTyping } = useTypingAnimation(content.message);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ animation: "guideOverlayIn 0.3s ease" }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative max-w-lg w-full rounded-2xl border border-gray-600 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
          animation: "guideDialogIn 0.3s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={onClose}
          className="absolute top-1 -right-11/12 z-10 text-gray-400 hover:text-white"
        />

        {/* Character header */}
        <div
          className="flex items-center gap-4 px-6 py-4 border-b border-gray-700"
          style={{
            background: `linear-gradient(90deg, ${character.color}15 0%, transparent 100%)`,
          }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-3xl shrink-0"
            style={{
              background: `${character.color}25`,
              border: `2px solid ${character.color}`,
              boxShadow: `0 0 20px ${character.color}30`,
            }}
          >
            {character.emoji}
          </div>
          <div>
            <div className="font-bold text-white text-lg">{character.name}</div>
            <div className="text-xs" style={{ color: character.color }}>
              {character.personality}
            </div>
          </div>
        </div>

        {/* Chat bubble */}
        <div className="px-6 py-5" onClick={isTyping ? skipTyping : undefined}>
          <div
            className="relative rounded-xl px-5 py-4 text-gray-200 leading-relaxed"
            style={{
              background: "#374151",
              borderLeft: `3px solid ${character.color}`,
            }}
          >
            <p className="mb-0 whitespace-pre-wrap">
              {displayedText}
              {isTyping && (
                <span
                  className="inline-block w-0.5 h-4 ml-0.5 align-text-bottom"
                  style={{
                    background: character.color,
                    animation: "guideCursorBlink 0.7s infinite",
                  }}
                />
              )}
            </p>

            {isTyping && (
              <div className="text-xs text-gray-500 mt-2">
                Click để bỏ qua...
              </div>
            )}
          </div>

          {/* Example */}
          {!isTyping && content.example && (
            <div
              className="mt-4 rounded-lg px-4 py-3 border border-gray-600"
              style={{
                background: "#1f293780",
                animation: "guideFadeIn 0.4s ease",
              }}
            >
              <div
                className="text-xs font-semibold mb-1"
                style={{ color: character.color }}
              >
                Ví dụ thực tế:
              </div>
              <div className="text-sm text-gray-300">{content.example}</div>
            </div>
          )}

          {/* Related symbols */}
          {!isTyping && content.relatedSymbols && content.relatedSymbols.length > 0 && (
            <div
              className="mt-3 flex items-center gap-2 flex-wrap"
              style={{ animation: "guideFadeIn 0.4s ease 0.1s both" }}
            >
              <span className="text-xs text-gray-500">Mã liên quan:</span>
              {content.relatedSymbols.map((s) => (
                <Tag key={s} color="blue" className="m-0!">
                  {s}
                </Tag>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

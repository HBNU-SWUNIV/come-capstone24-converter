import React from 'react';
import { IconDots } from '@tabler/icons-react';

interface ChatLoaderProps {
  size?: string; // 아이콘 크기 커스터마이징
  color?: string; // 아이콘 색상 커스터마이징
}

const ChatLoader: React.FC<ChatLoaderProps> = ({ size = '24px', color = 'gray' }) => {
  return (
    <div className="flex items-center">
      <IconDots className="animate-pulse" size={size} color={color} />
    </div>
  );
};

export default ChatLoader;
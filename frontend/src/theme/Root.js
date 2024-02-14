import React from 'react';
import MyChatbot from '@site/src/components/MyChatbot'; 

// Default implementation, that you can customize
export default function Root({children}) {
  return <> <MyChatbot/> {children}</>;
}
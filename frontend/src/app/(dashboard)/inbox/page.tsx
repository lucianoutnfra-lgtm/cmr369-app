import ChatList from '@/components/ChatList';
import ChatWindow from '@/components/ChatWindow';

export default function InboxPage() {
  return (
    <div className="flex h-full w-full">
      <div className="w-[350px] shrink-0 border-r border-border h-full flex flex-col bg-surface/50">
        <ChatList />
      </div>
      <div className="flex-1 h-full min-w-0 flex flex-col relative z-0">
        <ChatWindow />
      </div>
    </div>
  );
}

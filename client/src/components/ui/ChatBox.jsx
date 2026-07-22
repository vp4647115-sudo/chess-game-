import React, { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const ChatBox = ({ messages = [], onSendMessage }) => {
  const [text, setText] = useState('');
  const { user } = useAuthStore();

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text.trim());
    setText('');
  };

  return (
    <div className="flex flex-col h-full glass-panel rounded-2xl p-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
        <MessageSquare className="w-4 h-4 text-cyan-400" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Match Room Chat
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto my-3 space-y-2.5 pr-1">
        {messages.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500 italic">
            Say hello to your opponent!
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-300">{msg.sender}</span>
                <span className="text-[10px] text-slate-500">{msg.time}</span>
              </div>
              <p className="text-slate-200 mt-0.5 bg-slate-900/60 p-2 rounded-xl border border-slate-800/60">
                {msg.message}
              </p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSend} className="flex gap-2 pt-2 border-t border-slate-800">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
        />
        <button
          type="submit"
          className="p-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

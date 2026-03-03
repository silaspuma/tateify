'use client';

import { useState } from 'react';
import { Bell, Send, Lock } from 'lucide-react';

export default function AdminPage() {
  const [secret, setSecret] = useState('');
  const [authed, setAuthed] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [url, setUrl] = useState('/');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [sending, setSending] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (secret.trim()) setAuthed(true);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setSending(true);

    try {
      const res = await fetch('/api/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': secret,
        },
        body: JSON.stringify({ title, body, url }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({ type: 'error', message: data.error || 'Failed to send notifications' });
        if (res.status === 401) setAuthed(false);
      } else {
        setStatus({
          type: 'success',
          message: `Sent to ${data.sent} subscriber${data.sent !== 1 ? 's' : ''}${data.staleRemoved ? ` (${data.staleRemoved} stale removed)` : ''}.`,
        });
        setTitle('');
        setBody('');
        setUrl('/');
      }
    } catch {
      setStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setSending(false);
    }
  };

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <form
          onSubmit={handleAuth}
          className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-8 space-y-5"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-accent rounded-xl p-2">
              <Lock size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-wide">Admin Login</h1>
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1.5 uppercase tracking-wider">
              Admin Secret
            </label>
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-accent"
              placeholder="Enter your ADMIN_SECRET"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-accent hover:opacity-90 transition-opacity text-white font-bold py-2.5 rounded-xl text-sm"
          >
            Continue
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-lg mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <div className="bg-accent rounded-xl p-2">
            <Bell size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-wide">Send Notification</h1>
        </div>

        <form
          onSubmit={handleSend}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5"
        >
          <div>
            <label className="block text-xs text-white/60 mb-1.5 uppercase tracking-wider">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-accent"
              placeholder="e.g. New Song Out Now 🎵"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-white/60 mb-1.5 uppercase tracking-wider">
              Message
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-accent resize-none"
              placeholder="e.g. Stream the new track on TATEIFY now!"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-white/60 mb-1.5 uppercase tracking-wider">
              URL (optional)
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-accent"
              placeholder="/"
            />
          </div>

          {status && (
            <p
              className={`text-sm rounded-xl px-4 py-2.5 ${
                status.type === 'success'
                  ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                  : 'bg-red-500/15 text-red-400 border border-red-500/20'
              }`}
            >
              {status.message}
            </p>
          )}

          <button
            type="submit"
            disabled={sending}
            className="w-full flex items-center justify-center gap-2 bg-accent hover:opacity-90 disabled:opacity-50 transition-opacity text-white font-bold py-2.5 rounded-xl text-sm"
          >
            <Send size={16} />
            {sending ? 'Sending…' : 'Send to All Subscribers'}
          </button>
        </form>

        <p className="text-xs text-white/30 text-center">
          Only users who have installed the PWA and allowed notifications will receive this.
        </p>
      </div>
    </main>
  );
}

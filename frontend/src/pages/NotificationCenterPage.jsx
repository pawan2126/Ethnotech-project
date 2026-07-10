import React, { useContext, useState } from 'react';
import { DemoContext } from '../context/DemoContext';
import { Bell, BellOff, CheckCheck, Trash2, AlertTriangle, Zap, Info, Award, Filter, Clock } from 'lucide-react';

const NotificationCenterPage = () => {
  const { notifications, setNotifications, markAllRead, deleteNotification } = useContext(DemoContext);
  const [activeTab, setActiveTab] = useState('ALL');

  const tabs = [
    { id: 'ALL', label: 'All', icon: Bell },
    { id: 'SOS', label: 'SOS Alerts', icon: Zap },
    { id: 'SYSTEM', label: 'System', icon: Info },
    { id: 'RECOMMENDATION', label: 'AI Insights', icon: AlertTriangle },
    { id: 'BADGE', label: 'Badges', icon: Award },
  ];

  const filtered = activeTab === 'ALL'
    ? notifications
    : notifications.filter(n => n.type === activeTab);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const getTypeStyles = (type) => {
    switch (type) {
      case 'SOS': return { bg: 'bg-red-500/10', border: 'border-red-500/20', badge: 'bg-red-500', icon: Zap, color: 'text-red-400' };
      case 'SYSTEM': return { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', badge: 'bg-indigo-500', icon: Info, color: 'text-indigo-400' };
      case 'RECOMMENDATION': return { bg: 'bg-amber-500/10', border: 'border-amber-500/20', badge: 'bg-amber-500', icon: AlertTriangle, color: 'text-amber-400' };
      case 'BADGE': return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', badge: 'bg-emerald-500', icon: Award, color: 'text-emerald-400' };
      default: return { bg: 'bg-slate-800/40', border: 'border-slate-800', badge: 'bg-slate-600', icon: Bell, color: 'text-slate-400' };
    }
  };

  const formatTime = (time) => {
    return time || 'Unknown time';
  };

  return (
    <div className="space-y-6 fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 relative">
              <Bell className="w-6 h-6 text-indigo-500" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[8px] font-bold text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            Notification Center
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              unreadCount > 0
                ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20'
                : 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All Read</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex bg-slate-900/60 rounded-xl border border-slate-800 p-1 gap-1 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const count = tab.id === 'ALL'
            ? notifications.length
            : notifications.filter(n => n.type === tab.id).length;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id ? 'bg-red-500/30 text-red-300' : 'bg-slate-800 text-slate-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <BellOff className="w-12 h-12 mx-auto mb-3 text-slate-700" />
            <p className="text-sm font-semibold text-slate-500">No notifications in this category.</p>
          </div>
        ) : (
          filtered.map((n, i) => {
            const styles = getTypeStyles(n.type);
            const TypeIcon = styles.icon;
            return (
              <div
                key={n.id}
                className={`rounded-2xl border p-5 transition-all hover:shadow-lg ${styles.border} ${
                  n.isRead ? 'bg-slate-900/20 opacity-70' : `${styles.bg}`
                }`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`p-2.5 rounded-xl ${styles.bg} border ${styles.border} flex-shrink-0`}>
                    <TypeIcon className={`w-5 h-5 ${styles.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[8px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded text-white ${styles.badge}`}>
                            {n.type}
                          </span>
                          {!n.isRead && (
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-white">{n.title}</h4>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(n.time)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {!n.isRead && (
                          <button
                            onClick={() => markRead(n.id)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition"
                          >
                            <CheckCheck className="w-3 h-3" />
                            Mark Read
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(n.id)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationCenterPage;

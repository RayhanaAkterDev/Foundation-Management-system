import React from 'react';
import {
  HandCoins,
  HeartHandshake,
  Users,
  Megaphone,
  Building2,
  ShieldCheck,
  User,
  Activity,
} from 'lucide-react';

const TYPE_ICON = {
  donation:    { icon: HandCoins,     color: 'bg-emerald-50 text-emerald-600' },
  helpRequest: { icon: HeartHandshake,color: 'bg-[#0f766e]/10 text-[#0f766e]' },
  volunteer:   { icon: Users,         color: 'bg-blue-50 text-blue-600' },
  campaign:    { icon: Megaphone,     color: 'bg-amber-50 text-amber-600' },
  organization:{ icon: Building2,     color: 'bg-purple-50 text-purple-600' },
  verification:{ icon: ShieldCheck,   color: 'bg-emerald-50 text-emerald-600' },
  user:        { icon: User,          color: 'bg-[#f3f4f6] text-[#6b7280]' },
  response:    { icon: HeartHandshake,color: 'bg-[#0f766e]/10 text-[#0f766e]' },
};

/**
 * ActivityFeed — renders a list of activity events.
 *
 * Props:
 *   items  {Array}  — [{ id, type, text, time }]
 *   title  {string} — section title (default: "Recent Activity")
 */
const ActivityFeed = ({ items = [], title = 'Recent Activity' }) => {
  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
      <div className="border-b border-[#e5e7eb] px-5 py-4">
        <h2 className="font-['Fraunces'] text-base font-semibold text-text-primary">{title}</h2>
      </div>

      {items.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-[#6b7280]">No recent activity.</p>
      ) : (
        <ul className="divide-y divide-[#e5e7eb]">
          {items.map((item) => {
            const cfg = TYPE_ICON[item.type] || { icon: Activity, color: 'bg-[#f3f4f6] text-[#6b7280]' };
            const Icon = cfg.icon;
            return (
              <li key={item.id} className="flex items-start gap-3 px-5 py-4">
                <span
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${cfg.color}`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-text-primary leading-snug">{item.text}</p>
                  <p className="mt-0.5 text-xs text-[#6b7280]">{item.time}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ActivityFeed;

'use client';

import React, { useEffect, useState } from 'react';
import { Flame, ShoppingCart, Zap, CheckCircle2 } from 'lucide-react';

interface Props {
  slug: string;
}

export default function SocialProofBadges({ slug }: Props) {
  const [stats, setStats] = useState({
    views24h: 1,
    activeCart: 0,
    recentPurchases: 0,
    inStock: true,
  });

  useEffect(() => {
    // Record real view on mount
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, action: 'view' }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.views24h !== undefined) {
          setStats({
            views24h: data.views24h,
            activeCart: data.activeCart || 0,
            recentPurchases: data.recentPurchases || 0,
            inStock: true,
          });
        }
      })
      .catch(() => {});
  }, [slug]);

  return (
    <div className="flex flex-col gap-2.5 my-4 p-4 bg-[#FFFDF0] border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      {/* Live Indicator Header */}
      <div className="flex items-center justify-between pb-2 border-b-2 border-black/10">
        <span className="text-[11px] font-black uppercase tracking-wider text-black flex items-center gap-1.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-600"></span>
          </span>
          Live Activity Status
        </span>
        <span className="text-[10px] font-bold uppercase text-gray-500">Real-Time Data</span>
      </div>

      {/* Badges Grid */}
      <div className="flex flex-col gap-2">
        {/* 24-Hour Views */}
        <div className="flex items-center gap-2.5 text-xs font-bold text-black">
          <div className="w-6 h-6 rounded bg-[#FFE500] border-2 border-black flex items-center justify-center flex-shrink-0">
            <Flame className="w-3.5 h-3.5 text-black fill-black" />
          </div>
          <span>
            <strong className="font-black text-sm">{stats.views24h}</strong> {stats.views24h === 1 ? 'person' : 'people'} viewed this plan in the last 24 hours
          </span>
        </div>

        {/* Active Carts (If any) */}
        {stats.activeCart > 0 && (
          <div className="flex items-center gap-2.5 text-xs font-bold text-black">
            <div className="w-6 h-6 rounded bg-orange-400 border-2 border-black flex items-center justify-center flex-shrink-0">
              <ShoppingCart className="w-3.5 h-3.5 text-black" />
            </div>
            <span>
              In <strong className="font-black text-sm">{stats.activeCart}</strong> {stats.activeCart === 1 ? "person's" : "people's"} cart right now
            </span>
          </div>
        )}

        {/* Stock & Delivery */}
        <div className="flex items-center gap-2.5 text-xs font-bold text-black">
          <div className="w-6 h-6 rounded bg-green-400 border-2 border-black flex items-center justify-center flex-shrink-0">
            <Zap className="w-3.5 h-3.5 text-black fill-black" />
          </div>
          <span>
            <strong className="font-black text-green-800 uppercase">Instant PDF Access</strong> • Always in stock (Digital Product)
          </span>
        </div>

        {/* Guaranteed Delivery */}
        <div className="flex items-center gap-2.5 text-xs font-bold text-black">
          <div className="w-6 h-6 rounded bg-blue-300 border-2 border-black flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-black" />
          </div>
          <span>Step-by-step PDF blueprint & material cut list included</span>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import AIOCDashboard from './AIOCDashboard';

export default function AdminDashboard() {
  return (
    <div id="admin-dashboard-root" className="w-full">
      <div className="px-4 md:px-8 pt-4">
        <div className="bg-[#10B981]/10 border border-[#10B981]/20 px-4 py-2.5 rounded-2xl flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-[#10B981]">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>TIZIMGA AKKREDITATSIYA QILINGAN: <strong>ADMINISTRATOR MAQOMI (SHTAB BOSHLIG'I)</strong></span>
          </div>
          <span className="text-gray-400">RUXSAT DARAJASI: FULL_ROOT_ACCESS</span>
        </div>
      </div>
      <AIOCDashboard />
    </div>
  );
}

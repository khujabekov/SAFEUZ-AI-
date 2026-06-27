import React from 'react';
import AIOCDashboard from './AIOCDashboard';

export default function InspectorDashboard() {
  return (
    <div id="inspector-dashboard-root" className="w-full">
      <div className="px-4 md:px-8 pt-4">
        <div className="bg-[#3B82F6]/10 border border-[#3B82F6]/20 px-4 py-2.5 rounded-2xl flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-[#3B82F6]">
            <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" />
            <span>TIZIMGA AKKREDITATSIYA QILINGAN: <strong>KIBER-INSPEKTOR MAQOMI (HUDUDIY TEZKOR)</strong></span>
          </div>
          <span className="text-gray-400">RUXSAT DARAJASI: FIELD_OPERATOR_ACCESS</span>
        </div>
      </div>
      <AIOCDashboard />
    </div>
  );
}

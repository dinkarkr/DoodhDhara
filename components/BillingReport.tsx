
import React, { useMemo } from 'react';
import { MilkEntry, Party } from '../types';
import { Printer, FileCheck, Landmark } from 'lucide-react';

interface BillingReportProps {
  entries: MilkEntry[];
  parties: Party[];
}

const BillingReport: React.FC<BillingReportProps> = ({ entries, parties }) => {
  const reportData = useMemo(() => {
    const map: Record<string, { qty: number, amt: number, count: number }> = {};
    
    entries.forEach(e => {
      if (!map[e.partyId]) map[e.partyId] = { qty: 0, amt: 0, count: 0 };
      map[e.partyId].qty += e.quantity;
      map[e.partyId].amt += e.amount;
      map[e.partyId].count += 1;
    });

    return Object.entries(map).map(([id, stats]) => ({
      party: parties.find(p => p.id === id),
      ...stats
    })).filter(item => item.party);
  }, [entries, parties]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reportData.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Landmark className="w-5 h-5" />
              </div>
              <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                <Printer className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-lg font-bold text-slate-900">{item.party?.name}</h3>
            <p className="text-xs font-semibold text-slate-400 uppercase mb-4">{item.party?.type}</p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Total Volume</span>
                <span className="font-bold text-slate-900">{item.qty.toFixed(2)} Ltr</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Total Amount</span>
                <span className="font-bold text-emerald-600">₹{item.amt.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-slate-50 flex justify-between items-center mt-2">
                <span className="text-[10px] text-slate-400 font-bold">{item.count} Transactions</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold">SETTLEMENT READY</span>
              </div>
            </div>
          </div>
        ))}
        {reportData.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <FileCheck className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">No billing data available for the selected period.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingReport;

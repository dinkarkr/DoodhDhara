
import React, { useState, useMemo } from 'react';
import { MilkEntry, Party } from '../types';
import { FileText, ArrowRightLeft, Trash2, Download, Search, Filter } from 'lucide-react';

interface TransactionListProps {
  entries: MilkEntry[];
  parties: Party[];
  onDelete: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ entries, parties, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'PURCHASE' | 'SALE'>('ALL');

  const getPartyName = (id: string) => parties.find(p => p.id === id)?.name || 'Unknown';

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const partyName = getPartyName(entry.partyId).toLowerCase();
      const matchesSearch = partyName.includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'ALL' || entry.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [entries, parties, searchTerm, typeFilter]);

  const exportToCSV = () => {
    const headers = ['Date', 'Party', 'Type', 'Quantity', 'Fat', 'SNF', 'Rate', 'Amount'];
    const rows = filteredEntries.map(e => [
      e.date,
      getPartyName(e.partyId),
      e.type,
      e.quantity,
      e.fat,
      e.snf,
      e.rate,
      e.amount
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `dairy_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg">
              <ArrowRightLeft className="w-5 h-5 text-slate-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Transaction Registry</h2>
          </div>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-all font-semibold text-sm"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by party name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="ALL">All Transactions</option>
              <option value="PURCHASE">Only Purchases</option>
              <option value="SALE">Only Sales</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Party</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Qty (L)</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Fat / SNF</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Rate</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Amount</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEntries.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center">
                    <FileText className="w-12 h-12 text-slate-200 mb-3" />
                    <p>No results found for current filters.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{new Date(entry.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{getPartyName(entry.partyId)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      entry.type === 'PURCHASE' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {entry.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 text-right font-mono">{entry.quantity.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 text-right font-mono">
                    <span className="text-slate-900 font-semibold">{entry.fat.toFixed(1)}</span> / {entry.snf.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 text-right">₹{entry.rate.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">₹{entry.amount.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => {
                        if(confirm('Are you sure you want to delete this entry?')) {
                          onDelete(entry.id);
                        }
                      }}
                      className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;


import React, { useState, useEffect } from 'react';
import { Party, MilkEntry, TransactionType, AppConfig } from '../types';
import { calculateSNF, calculateMilkRate, calculateTotalAmount } from '../services/calculationService';
import { PlusCircle, CheckCircle2, AlertCircle } from 'lucide-react';

interface MilkFormProps {
  type: TransactionType;
  parties: Party[];
  config: AppConfig;
  onAddEntry: (entry: MilkEntry) => void;
}

const MilkForm: React.FC<MilkFormProps> = ({ type, parties, config, onAddEntry }) => {
  const [formData, setFormData] = useState({
    partyId: '',
    quantity: '',
    fat: '',
    clr: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [calcResult, setCalcResult] = useState({
    snf: 0,
    rate: 0,
    amount: 0
  });

  const [error, setError] = useState('');

  useEffect(() => {
    const fat = parseFloat(formData.fat) || 0;
    const clr = parseFloat(formData.clr) || 0;
    const qty = parseFloat(formData.quantity) || 0;

    const snf = calculateSNF(clr, fat);
    
    const fatRate = type === 'SALE' ? config.saleFatRate : config.purchaseFatRate;
    const snfRate = type === 'SALE' ? config.saleSnfRate : config.purchaseSnfRate;
    
    const rate = calculateMilkRate(fat, snf, fatRate, snfRate);
    const amount = calculateTotalAmount(qty, rate);

    setCalcResult({ snf, rate, amount });
  }, [formData, type, config]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.partyId) return setError('Please select a party');
    if (parseFloat(formData.quantity) <= 0) return setError('Quantity must be greater than 0');
    if (parseFloat(formData.fat) < 0 || parseFloat(formData.fat) > 15) return setError('Invalid FAT percentage');

    const entry: MilkEntry = {
      id: crypto.randomUUID(),
      date: formData.date,
      partyId: formData.partyId,
      type,
      quantity: parseFloat(formData.quantity),
      fat: parseFloat(formData.fat),
      clr: parseFloat(formData.clr) || 0,
      snf: calcResult.snf,
      rate: calcResult.rate,
      amount: calcResult.amount,
      status: 'PENDING',
    };

    onAddEntry(entry);
    setFormData({
      ...formData,
      quantity: '',
      fat: '',
      clr: '',
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg ${type === 'PURCHASE' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
          <PlusCircle className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          New {type === 'PURCHASE' ? 'Collection' : 'Dispatch'}
        </h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl flex items-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Select {type === 'PURCHASE' ? 'Contractor' : 'Buyer'}</label>
            <select 
              value={formData.partyId}
              onChange={(e) => setFormData({...formData, partyId: e.target.value})}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-slate-50 transition-all outline-none"
              required
            >
              <option value="">Choose...</option>
              {parties
                .filter(p => type === 'PURCHASE' ? p.type === 'CONTRACTOR' : p.type === 'CLIENT')
                .map(p => (
                  <option key={p.id} value={p.id}>{p.name} {p.village ? `(${p.village})` : ''}</option>
                ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Date</label>
            <input 
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Quantity (Litres)</label>
            <input 
              type="number" step="0.01"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              placeholder="0.00"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 font-mono"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">FAT %</label>
            <input 
              type="number" step="0.1"
              value={formData.fat}
              onChange={(e) => setFormData({...formData, fat: e.target.value})}
              placeholder="e.g. 6.5"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 font-mono"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">CLR Reading</label>
            <input 
              type="number" step="0.5"
              value={formData.clr}
              onChange={(e) => setFormData({...formData, clr: e.target.value})}
              placeholder="e.g. 28.5"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 font-mono"
            />
          </div>

          <div className="flex flex-col justify-end">
            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Finalize Entry
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-blue-50/50 rounded-2xl border border-blue-100 border-dashed">
          <div className="flex flex-col items-center p-2">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">SNF</span>
            <span className="text-xl font-bold text-slate-700 font-mono">{calcResult.snf.toFixed(2)}%</span>
          </div>
          <div className="flex flex-col items-center p-2 border-x border-blue-100">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Rate / Ltr</span>
            <span className="text-xl font-bold text-blue-700 font-mono">₹{calcResult.rate.toFixed(2)}</span>
          </div>
          <div className="flex flex-col items-center p-2">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Line Amount</span>
            <span className="text-xl font-bold text-emerald-600 font-mono">₹{calcResult.amount.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MilkForm;

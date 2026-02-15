
import React, { useState, useEffect } from 'react';
import { Party, MilkEntry, TransactionType, AppConfig, DEFAULT_CONFIG } from './types';
import { api } from './services/api';
import Dashboard from './components/Dashboard';
import MilkForm from './components/MilkForm';
import TransactionList from './components/TransactionList';
import BillingReport from './components/BillingReport';
import { 
  LayoutDashboard, 
  Truck, 
  ArrowUpRight, 
  Users,
  Settings,
  Menu,
  X,
  Plus,
  Coins,
  History,
  FileText,
  RefreshCcw
} from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'PURCHASE' | 'SALE' | 'PARTIES' | 'BILLING' | 'SETTINGS'>('DASHBOARD');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [parties, setParties] = useState<Party[]>([]);
  const [entries, setEntries] = useState<MilkEntry[]>([]);
  
  const [newPartyName, setNewPartyName] = useState('');
  const [newPartyType, setNewPartyType] = useState<'CONTRACTOR' | 'CLIENT'>('CONTRACTOR');
  const [newPartyVillage, setNewPartyVillage] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    const data = await api.fetchEntries();
    setEntries(data);
    
    const savedParties = localStorage.getItem('dd_parties');
    if (savedParties) setParties(JSON.parse(savedParties));
    
    const savedConfig = localStorage.getItem('dd_config');
    if (savedConfig) setConfig(JSON.parse(savedConfig));
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddEntry = async (entry: MilkEntry) => {
    const saved = await api.saveEntry(entry);
    setEntries(prev => [saved, ...prev]);
  };

  const handleDeleteEntry = async (id: string) => {
    await api.deleteEntry(id);
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleAddParty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartyName) return;
    const party: Party = {
      id: crypto.randomUUID(),
      name: newPartyName,
      type: newPartyType,
      contact: '',
      village: newPartyVillage
    };
    const updated = [...parties, party];
    setParties(updated);
    localStorage.setItem('dd_parties', JSON.stringify(updated));
    setNewPartyName('');
    setNewPartyVillage('');
  };

  const NavItem = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        activeTab === id 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-semibold">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-100">D</div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">DoodhDhara</span>
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto pr-2">
            <NavItem id="DASHBOARD" label="Insights" icon={LayoutDashboard} />
            <NavItem id="PURCHASE" label="Collections" icon={Truck} />
            <NavItem id="SALE" label="Bulk Sales" icon={ArrowUpRight} />
            <NavItem id="BILLING" label="Billing & Reports" icon={FileText} />
            <NavItem id="PARTIES" label="Directory" icon={Users} />
            <div className="h-px bg-slate-100 my-4"></div>
            <NavItem id="SETTINGS" label="Market Rates" icon={Settings} />
          </nav>

          <button onClick={loadData} className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase py-2">
            <RefreshCcw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            Sync Data
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between lg:justify-end">
          <button className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-slate-900">Enterprise Admin</span>
              <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Backend Connected</span>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center font-bold text-slate-600">AD</div>
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 pb-20">
          {activeTab === 'DASHBOARD' && (
            <div className="space-y-8">
              <Dashboard entries={entries} contractorsCount={parties.filter(p => p.type === 'CONTRACTOR').length} />
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-900">
                  <History className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-bold">Recent Stream</h2>
                </div>
                <TransactionList entries={entries.slice(0, 8)} parties={parties} onDelete={handleDeleteEntry} />
              </div>
            </div>
          )}

          {activeTab === 'PURCHASE' && (
            <div className="space-y-8">
              <MilkForm type="PURCHASE" parties={parties} config={config} onAddEntry={handleAddEntry} />
              <TransactionList entries={entries.filter(e => e.type === 'PURCHASE')} parties={parties} onDelete={handleDeleteEntry} />
            </div>
          )}

          {activeTab === 'SALE' && (
            <div className="space-y-8">
              <MilkForm type="SALE" parties={parties} config={config} onAddEntry={handleAddEntry} />
              <TransactionList entries={entries.filter(e => e.type === 'SALE')} parties={parties} onDelete={handleDeleteEntry} />
            </div>
          )}

          {activeTab === 'BILLING' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Billing & Settlements</h1>
                <p className="text-slate-500 mt-1 font-medium">Automatic calculation of party-wise dues and printable statements.</p>
              </div>
              <BillingReport entries={entries} parties={parties} />
            </div>
          )}

          {activeTab === 'PARTIES' && (
            <div className="space-y-8">
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                <h2 className="text-xl font-bold mb-6 text-slate-900">Register New Party</h2>
                <form onSubmit={handleAddParty} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Legal Name</label>
                    <input type="text" value={newPartyName} onChange={(e) => setNewPartyName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none bg-slate-50 focus:ring-2 focus:ring-blue-500 font-medium" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Category</label>
                    <select value={newPartyType} onChange={(e) => setNewPartyType(e.target.value as any)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none bg-slate-50 focus:ring-2 focus:ring-blue-500 font-medium">
                      <option value="CONTRACTOR">Contractor</option>
                      <option value="CLIENT">Client</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Location</label>
                    <input type="text" value={newPartyVillage} onChange={(e) => setNewPartyVillage(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none bg-slate-50 focus:ring-2 focus:ring-blue-500 font-medium" />
                  </div>
                  <button type="submit" className="bg-blue-600 text-white font-bold py-2.5 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100">
                    <Plus className="w-5 h-5" /> Save Party
                  </button>
                </form>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {parties.map(p => (
                  <div key={p.id} className="bg-white p-6 rounded-3xl border border-slate-100 hover:border-blue-200 transition-all">
                    <div className={`w-fit px-2 py-1 rounded text-[10px] font-black uppercase mb-4 ${p.type === 'CONTRACTOR' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>{p.type}</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{p.name}</h3>
                    <p className="text-sm text-slate-400 font-medium">{p.village || 'No specific location'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'SETTINGS' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 space-y-6">
                  <h2 className="text-xl font-bold flex items-center gap-2"><Truck className="w-5 h-5 text-blue-600" /> Purchase Rates</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500">FAT (Per Kg)</label>
                      <input type="number" value={config.purchaseFatRate} onChange={(e) => setConfig({...config, purchaseFatRate: Number(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-mono text-lg" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500">SNF (Per Kg)</label>
                      <input type="number" value={config.purchaseSnfRate} onChange={(e) => setConfig({...config, purchaseSnfRate: Number(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-mono text-lg" />
                    </div>
                  </div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 space-y-6">
                  <h2 className="text-xl font-bold flex items-center gap-2"><ArrowUpRight className="w-5 h-5 text-emerald-600" /> Sales Rates</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500">FAT (Per Kg)</label>
                      <input type="number" value={config.saleFatRate} onChange={(e) => setConfig({...config, saleFatRate: Number(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-mono text-lg" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500">SNF (Per Kg)</label>
                      <input type="number" value={config.saleSnfRate} onChange={(e) => setConfig({...config, saleSnfRate: Number(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-mono text-lg" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;

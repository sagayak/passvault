
import React from 'react';
import { Menu, FileDown, FileUp, Lock as LockIcon, Plus, X, Loader2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { Section, PasswordEntry, VehicleEntry, InsuranceEntry } from './types';
import { Sidebar } from './components/Sidebar';
import { PasswordTable } from './components/PasswordTable';
import { MiscellaneousGrid } from './components/MiscellaneousGrid';
import { InsuranceTable } from './components/InsuranceTable';
import { Modal, Dropdown, useToast, ToastContainer } from './components/UI';

// Supabase Configuration
const SUPABASE_URL = 'https://yvbvcmfonnbhzwhrzbxt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_t3kSHlUw6PyrywqBgZlRUA_w7DFBIPY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const App: React.FC = () => {
  // Auth state
  const [isLocked, setIsLocked] = React.useState(true);
  const [passwordInput, setPasswordInput] = React.useState('');
  
  // App state
  const [activeSection, setActiveSection] = React.useState<Section>(Section.SOCIAL);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  
  // Modals state
  const [isAddPasswordModalOpen, setIsAddPasswordModalOpen] = React.useState(false);
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = React.useState(false);
  const [isAddInsuranceModalOpen, setIsAddInsuranceModalOpen] = React.useState(false);
  const [isEditPasswordModalOpen, setIsEditPasswordModalOpen] = React.useState(false);
  const [isEditVehicleModalOpen, setIsEditVehicleModalOpen] = React.useState(false);
  const [isEditInsuranceModalOpen, setIsEditInsuranceModalOpen] = React.useState(false);

  // Form states
  const [newEntryForm, setNewEntryForm] = React.useState({
    service: '',
    username: '',
    password: ''
  });
  const [newVehicleForm, setNewVehicleForm] = React.useState<Omit<VehicleEntry, 'id'>>({
    name: '',
    type: 'Car',
    lastService: '',
    nextService: ''
  });
  const [newInsuranceForm, setNewInsuranceForm] = React.useState<Omit<InsuranceEntry, 'id'>>({
    name: '',
    dueDate: '',
    premium: '',
    comments: '',
    isPaid: false
  });
  const [editingPassword, setEditingPassword] = React.useState<PasswordEntry | null>(null);
  const [editingVehicle, setEditingVehicle] = React.useState<VehicleEntry | null>(null);
  const [editingInsurance, setEditingInsurance] = React.useState<InsuranceEntry | null>(null);

  // Data state
  const [passwords, setPasswords] = React.useState<PasswordEntry[]>([]);
  const [vehicles, setVehicles] = React.useState<VehicleEntry[]>([]);
  const [insurances, setInsurances] = React.useState<InsuranceEntry[]>([]);

  // Import state
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: passData, error: passError } = await supabase
        .from('passwords')
        .select('*')
        .order('created_at', { ascending: false });
      
      const { data: vehData, error: vehError } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: insData, error: insError } = await supabase
        .from('insurances')
        .select('*')
        .order('created_at', { ascending: false });

      if (passError) throw passError;
      if (vehError) throw vehError;
      if (insError) throw insError;

      setPasswords(passData || []);
      
      const mappedVehicles: VehicleEntry[] = (vehData || []).map((v: any) => ({
        id: v.id,
        name: v.name,
        type: v.type,
        lastService: v.last_service,
        nextService: v.next_service
      }));
      setVehicles(mappedVehicles);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const mappedInsurances: InsuranceEntry[] = (insData || []).map((i: any) => {
        const dueDate = new Date(i.due_date);
        // Automatic unpaid logic: if date passed and marked as paid, it resets to unpaid for the user
        const isActuallyPaid = (dueDate < today) ? false : (i.is_paid ?? false);
        
        return {
          id: i.id,
          name: i.name,
          dueDate: i.due_date,
          premium: i.premium,
          comments: i.comments,
          isPaid: isActuallyPaid
        };
      });
      setInsurances(mappedInsurances);

    } catch (error: any) {
      toast({ title: 'Fetch Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '1218') {
      setIsLocked(false);
      setPasswordInput('');
      toast({ title: 'Vault Unlocked', description: 'Welcome back to PassVault.' });
      await fetchData();
    } else {
      toast({ title: 'Authentication Failed', description: 'Invalid master password.', variant: 'destructive' });
    }
  };

  // --- CRUD Handlers ---

  const handleDeletePassword = async (id: string) => {
    try {
      const { error } = await supabase.from('passwords').delete().eq('id', id);
      if (error) throw error;
      setPasswords(prev => prev.filter(p => p.id !== id));
      toast({ title: 'Entry Removed', description: 'The password record has been deleted.' });
    } catch (error: any) {
      toast({ title: 'Delete Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    try {
      const { error } = await supabase.from('vehicles').delete().eq('id', id);
      if (error) throw error;
      setVehicles(prev => prev.filter(v => v.id !== id));
      toast({ title: 'Record Deleted', description: 'The vehicle record has been removed.' });
    } catch (error: any) {
      toast({ title: 'Delete Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDeleteInsurance = async (id: string) => {
    try {
      const { error } = await supabase.from('insurances').delete().eq('id', id);
      if (error) throw error;
      setInsurances(prev => prev.filter(i => i.id !== id));
      toast({ title: 'Policy Removed', description: 'The insurance record has been deleted.' });
    } catch (error: any) {
      toast({ title: 'Delete Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleTogglePaid = async (entry: InsuranceEntry) => {
    const newStatus = !entry.isPaid;
    try {
      const { error } = await supabase.from('insurances').update({ is_paid: newStatus }).eq('id', entry.id);
      if (error) throw error;
      setInsurances(prev => prev.map(i => i.id === entry.id ? { ...i, isPaid: newStatus } : i));
      toast({ title: newStatus ? 'Marked as Paid' : 'Marked as Unpaid', description: entry.name });
    } catch (error: any) {
      toast({ title: 'Update Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleAddPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = {
      service: newEntryForm.service,
      username: newEntryForm.username,
      password: newEntryForm.password,
      category: activeSection === Section.SOCIAL ? 'social' : 'personal'
    };
    try {
      const { data, error } = await supabase.from('passwords').insert([newEntry]).select();
      if (error) throw error;
      if (data) {
        setPasswords(prev => [data[0], ...prev]);
        setIsAddPasswordModalOpen(false);
        setNewEntryForm({ service: '', username: '', password: '' });
        toast({ title: 'Entry Added', description: `${newEntry.service} saved.` });
      }
    } catch (error: any) {
      toast({ title: 'Error Saving', description: error.message, variant: 'destructive' });
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    const dbPayload = {
      name: newVehicleForm.name,
      type: newVehicleForm.type,
      last_service: newVehicleForm.lastService,
      next_service: newVehicleForm.nextService
    };
    try {
      const { data, error } = await supabase.from('vehicles').insert([dbPayload]).select();
      if (error) throw error;
      if (data) {
        setVehicles(prev => [{
          id: data[0].id,
          name: data[0].name,
          type: data[0].type,
          lastService: data[0].last_service,
          nextService: data[0].next_service
        }, ...prev]);
        setIsAddVehicleModalOpen(false);
        setNewVehicleForm({ name: '', type: 'Car', lastService: '', nextService: '' });
        toast({ title: 'Vehicle Added', description: `${newVehicleForm.name} added.` });
      }
    } catch (error: any) {
      toast({ title: 'Error Saving', description: error.message, variant: 'destructive' });
    }
  };

  const handleAddInsurance = async (e: React.FormEvent) => {
    e.preventDefault();
    const dbPayload = {
      name: newInsuranceForm.name,
      due_date: newInsuranceForm.dueDate,
      premium: newInsuranceForm.premium,
      comments: newInsuranceForm.comments,
      is_paid: newInsuranceForm.isPaid
    };
    try {
      const { data, error } = await supabase.from('insurances').insert([dbPayload]).select();
      if (error) throw error;
      if (data) {
        setInsurances(prev => [{
          id: data[0].id,
          name: data[0].name,
          dueDate: data[0].due_date,
          premium: data[0].premium,
          comments: data[0].comments,
          isPaid: data[0].is_paid
        }, ...prev]);
        setIsAddInsuranceModalOpen(false);
        setNewInsuranceForm({ name: '', dueDate: '', premium: '', comments: '', isPaid: false });
        toast({ title: 'Insurance Added', description: `${newInsuranceForm.name} policy saved.` });
      }
    } catch (error: any) {
      toast({ title: 'Error Saving', description: error.message, variant: 'destructive' });
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPassword) return;
    try {
      const { error } = await supabase.from('passwords').update({
        service: editingPassword.service,
        username: editingPassword.username,
        password: editingPassword.password
      }).eq('id', editingPassword.id);
      if (error) throw error;
      setPasswords(prev => prev.map(p => p.id === editingPassword.id ? editingPassword : p));
      setIsEditPasswordModalOpen(false);
      setEditingPassword(null);
      toast({ title: 'Updated', description: 'Changes saved.' });
    } catch (error: any) {
      toast({ title: 'Update Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleUpdateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle) return;
    try {
      const { error } = await supabase.from('vehicles').update({
        name: editingVehicle.name,
        type: editingVehicle.type,
        last_service: editingVehicle.lastService,
        next_service: editingVehicle.nextService
      }).eq('id', editingVehicle.id);
      if (error) throw error;
      setVehicles(prev => prev.map(v => v.id === editingVehicle.id ? editingVehicle : v));
      setIsEditVehicleModalOpen(false);
      setEditingVehicle(null);
      toast({ title: 'Updated', description: 'Changes saved.' });
    } catch (error: any) {
      toast({ title: 'Update Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleUpdateInsurance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInsurance) return;
    try {
      const { error } = await supabase.from('insurances').update({
        name: editingInsurance.name,
        due_date: editingInsurance.dueDate,
        premium: editingInsurance.premium,
        comments: editingInsurance.comments,
        is_paid: editingInsurance.isPaid
      }).eq('id', editingInsurance.id);
      if (error) throw error;
      setInsurances(prev => prev.map(i => i.id === editingInsurance.id ? editingInsurance : i));
      setIsEditInsuranceModalOpen(false);
      setEditingInsurance(null);
      toast({ title: 'Updated', description: 'Insurance policy updated.' });
    } catch (error: any) {
      toast({ title: 'Update Error', description: error.message, variant: 'destructive' });
    }
  };

  // --- Export Logic ---
  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => Object.values(obj).map(v => `"${v}"`).join(',')).join('\n');
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: 'Export Complete', description: `${filename}.csv saved.` });
  };

  const handleExportCurrent = () => {
    let dataToExport: any[] = [];
    let name = '';
    if (activeSection === Section.SOCIAL) {
      dataToExport = passwords.filter(p => p.category === 'social');
      name = 'social_passwords';
    } else if (activeSection === Section.PERSONAL) {
      dataToExport = passwords.filter(p => p.category === 'personal');
      name = 'personal_passwords';
    } else if (activeSection === Section.INSURANCE) {
      dataToExport = insurances;
      name = 'insurance_policies';
    } else {
      dataToExport = vehicles;
      name = 'vehicles';
    }
    exportToCSV(dataToExport, name);
  };

  const handleExportAll = () => {
    exportToCSV([...passwords, ...vehicles, ...insurances], 'passvault_complete_export');
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const csv = event.target?.result as string;
      const lines = csv.split('\n');
      if (lines.length < 2) return;

      const headers = lines[0].split(',').map(h => h.trim());
      const passBatch: any[] = [];
      const vehBatch: any[] = [];
      const insBatch: any[] = [];

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const values = lines[i].split(',').map(v => v.replace(/^"|"$/g, '').trim());
        const entry: any = {};
        headers.forEach((h, idx) => { entry[h] = values[idx]; });

        if (entry.service && entry.password) {
          passBatch.push({ service: entry.service, username: entry.username, password: entry.password, category: entry.category || 'social' });
        } else if (entry.name && (entry.last_service || entry.lastService)) {
          vehBatch.push({ name: entry.name, type: entry.type || 'Car', last_service: entry.last_service || entry.lastService, next_service: entry.next_service || entry.nextService });
        } else if (entry.name && (entry.due_date || entry.dueDate)) {
          insBatch.push({ name: entry.name, due_date: entry.due_date || entry.dueDate, premium: entry.premium || '', comments: entry.comments || '', is_paid: entry.is_paid === 'true' });
        }
      }

      try {
        if (passBatch.length) await supabase.from('passwords').insert(passBatch);
        if (vehBatch.length) await supabase.from('vehicles').insert(vehBatch);
        if (insBatch.length) await supabase.from('insurances').insert(insBatch);
        await fetchData();
        toast({ title: 'Imported', description: 'Data synced successfully.' });
      } catch (err: any) {
        toast({ title: 'Import Failed', description: err.message, variant: 'destructive' });
      }
    };
    reader.readAsText(file);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-3">
          <Loader2 className="animate-spin text-blue-600" size={32} />
          <p className="font-medium">Syncing vault contents...</p>
        </div>
      );
    }

    switch (activeSection) {
      case Section.SOCIAL:
        return <PasswordTable entries={passwords.filter(p => p.category === 'social')} onDelete={handleDeletePassword} onEdit={(p) => { setEditingPassword(p); setIsEditPasswordModalOpen(true); }} />;
      case Section.PERSONAL:
        return <PasswordTable entries={passwords.filter(p => p.category === 'personal')} onDelete={handleDeletePassword} onEdit={(p) => { setEditingPassword(p); setIsEditPasswordModalOpen(true); }} />;
      case Section.INSURANCE:
        return <InsuranceTable entries={insurances} onDelete={handleDeleteInsurance} onEdit={(i) => { setEditingInsurance(i); setIsEditInsuranceModalOpen(true); }} onTogglePaid={handleTogglePaid} />;
      case Section.MISCELLANEOUS:
        return <MiscellaneousGrid entries={vehicles} onDelete={handleDeleteVehicle} onEdit={(v) => { setEditingVehicle(v); setIsEditVehicleModalOpen(true); }} />;
      default:
        return null;
    }
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case Section.SOCIAL: return 'Social Passwords';
      case Section.PERSONAL: return 'Personal Passwords';
      case Section.INSURANCE: return 'Insurance Policies';
      case Section.MISCELLANEOUS: return 'Vehicle Maintenance';
      default: return '';
    }
  };

  const openAddModal = () => {
    if (activeSection === Section.SOCIAL || activeSection === Section.PERSONAL) setIsAddPasswordModalOpen(true);
    else if (activeSection === Section.INSURANCE) setIsAddInsuranceModalOpen(true);
    else if (activeSection === Section.MISCELLANEOUS) setIsAddVehicleModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".csv" className="hidden" />

      {/* Auth Modal */}
      <Modal isOpen={isLocked}>
        <form onSubmit={handleUnlock} className="flex flex-col items-center text-center">
          <div className="bg-blue-100 p-4 rounded-full text-blue-600 mb-6 shadow-inner">
            <LockIcon size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vault Locked</h2>
          <p className="text-gray-500 mb-8 max-w-xs leading-relaxed">Enter your master password to unlock PassVault.</p>
          <div className="w-full space-y-4">
            <input 
              type="password" 
              placeholder="Master Password" 
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              value={passwordInput} 
              onChange={(e) => setPasswordInput(e.target.value)} 
              autoFocus 
            />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg">Unlock Vault</button>
          </div>
        </form>
      </Modal>

      {/* Add Password Modal */}
      <Modal isOpen={isAddPasswordModalOpen}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Add Entry</h2>
          <button onClick={() => setIsAddPasswordModalOpen(false)}><X size={20} /></button>
        </div>
        <form onSubmit={handleAddPassword} className="space-y-4">
          <input type="text" placeholder="Service" required className="w-full p-2 border rounded-lg" value={newEntryForm.service} onChange={e => setNewEntryForm({...newEntryForm, service: e.target.value})} />
          <input type="text" placeholder="Username" required className="w-full p-2 border rounded-lg" value={newEntryForm.username} onChange={e => setNewEntryForm({...newEntryForm, username: e.target.value})} />
          <input type="password" placeholder="Password" required className="w-full p-2 border rounded-lg" value={newEntryForm.password} onChange={e => setNewEntryForm({...newEntryForm, password: e.target.value})} />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg">Save</button>
        </form>
      </Modal>

      {/* Add Insurance Modal */}
      <Modal isOpen={isAddInsuranceModalOpen}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">New Insurance</h2>
          <button onClick={() => setIsAddInsuranceModalOpen(false)}><X size={20} /></button>
        </div>
        <form onSubmit={handleAddInsurance} className="space-y-4">
          <input type="text" placeholder="Insurance Name" required className="w-full p-2 border rounded-lg" value={newInsuranceForm.name} onChange={e => setNewInsuranceForm({...newInsuranceForm, name: e.target.value})} />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">Due Date</label>
              <input type="date" required className="w-full p-2 border rounded-lg" value={newInsuranceForm.dueDate} onChange={e => setNewInsuranceForm({...newInsuranceForm, dueDate: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-gray-500">Premium</label>
              <input type="text" placeholder="e.g. $120/mo" required className="w-full p-2 border rounded-lg" value={newInsuranceForm.premium} onChange={e => setNewInsuranceForm({...newInsuranceForm, premium: e.target.value})} />
            </div>
          </div>
          <div className="flex items-center gap-2 py-2">
            <input 
              type="checkbox" 
              id="isPaidAdd" 
              checked={newInsuranceForm.isPaid} 
              onChange={e => setNewInsuranceForm({...newInsuranceForm, isPaid: e.target.checked})} 
            />
            <label htmlFor="isPaidAdd" className="text-sm font-medium text-gray-700">Already Paid?</label>
          </div>
          <textarea placeholder="Comments" className="w-full p-2 border rounded-lg" value={newInsuranceForm.comments} onChange={e => setNewInsuranceForm({...newInsuranceForm, comments: e.target.value})} />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg">Save Policy</button>
        </form>
      </Modal>

      {/* Add Vehicle Modal */}
      <Modal isOpen={isAddVehicleModalOpen}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Add Vehicle</h2>
          <button onClick={() => setIsAddVehicleModalOpen(false)}><X size={20} /></button>
        </div>
        <form onSubmit={handleAddVehicle} className="space-y-4">
          <input type="text" placeholder="Vehicle Name" required className="w-full p-2 border rounded-lg" value={newVehicleForm.name} onChange={e => setNewVehicleForm({...newVehicleForm, name: e.target.value})} />
          <select className="w-full p-2 border rounded-lg" value={newVehicleForm.type} onChange={e => setNewVehicleForm({...newVehicleForm, type: e.target.value as 'Car' | 'Bike'})}>
            <option value="Car">Car</option>
            <option value="Bike">Bike</option>
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input type="date" required className="w-full p-2 border rounded-lg" value={newVehicleForm.lastService} onChange={e => setNewVehicleForm({...newVehicleForm, lastService: e.target.value})} />
            <input type="date" required className="w-full p-2 border rounded-lg" value={newVehicleForm.nextService} onChange={e => setNewVehicleForm({...newVehicleForm, nextService: e.target.value})} />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg">Save Vehicle</button>
        </form>
      </Modal>

      {/* Edit Insurance Modal */}
      <Modal isOpen={isEditInsuranceModalOpen}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Edit Insurance</h2>
          <button onClick={() => setIsEditInsuranceModalOpen(false)}><X size={20} /></button>
        </div>
        {editingInsurance && (
          <form onSubmit={handleUpdateInsurance} className="space-y-4">
            <input type="text" required className="w-full p-2 border rounded-lg" value={editingInsurance.name} onChange={e => setEditingInsurance({...editingInsurance, name: e.target.value})} />
            <div className="grid grid-cols-2 gap-2">
              <input type="date" required className="w-full p-2 border rounded-lg" value={editingInsurance.dueDate} onChange={e => setEditingInsurance({...editingInsurance, dueDate: e.target.value})} />
              <input type="text" required className="w-full p-2 border rounded-lg" value={editingInsurance.premium} onChange={e => setEditingInsurance({...editingInsurance, premium: e.target.value})} />
            </div>
            <div className="flex items-center gap-2 py-2">
              <input 
                type="checkbox" 
                id="isPaidEdit" 
                checked={editingInsurance.isPaid} 
                onChange={e => setEditingInsurance({...editingInsurance, isPaid: e.target.checked})} 
              />
              <label htmlFor="isPaidEdit" className="text-sm font-medium text-gray-700">Paid</label>
            </div>
            <textarea className="w-full p-2 border rounded-lg" value={editingInsurance.comments} onChange={e => setEditingInsurance({...editingInsurance, comments: e.target.value})} />
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg">Update</button>
          </form>
        )}
      </Modal>

      {/* Edit Password Modal */}
      <Modal isOpen={isEditPasswordModalOpen}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Edit Password</h2>
          <button onClick={() => setIsEditPasswordModalOpen(false)}><X size={20} /></button>
        </div>
        {editingPassword && (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <input type="text" required className="w-full p-2 border rounded-lg" value={editingPassword.service} onChange={e => setEditingPassword({...editingPassword, service: e.target.value})} />
            <input type="text" required className="w-full p-2 border rounded-lg" value={editingPassword.username} onChange={e => setEditingPassword({...editingPassword, username: e.target.value})} />
            <input type="password" required className="w-full p-2 border rounded-lg" value={editingPassword.password} onChange={e => setEditingPassword({...editingPassword, password: e.target.value})} />
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg">Update</button>
          </form>
        )}
      </Modal>

      {/* Edit Vehicle Modal */}
      <Modal isOpen={isEditVehicleModalOpen}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Edit Vehicle</h2>
          <button onClick={() => setIsEditVehicleModalOpen(false)}><X size={20} /></button>
        </div>
        {editingVehicle && (
          <form onSubmit={handleUpdateVehicle} className="space-y-4">
            <input type="text" required className="w-full p-2 border rounded-lg" value={editingVehicle.name} onChange={e => setEditingVehicle({...editingVehicle, name: e.target.value})} />
            <select className="w-full p-2 border rounded-lg" value={editingVehicle.type} onChange={e => setEditingVehicle({...editingVehicle, type: e.target.value as 'Car' | 'Bike'})}>
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
            </select>
            <div className="grid grid-cols-2 gap-2">
              <input type="date" required className="w-full p-2 border rounded-lg" value={editingVehicle.lastService} onChange={e => setEditingVehicle({...editingVehicle, lastService: e.target.value})} />
              <input type="date" required className="w-full p-2 border rounded-lg" value={editingVehicle.nextService} onChange={e => setEditingVehicle({...editingVehicle, nextService: e.target.value})} />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg">Update</button>
          </form>
        )}
      </Modal>

      {!isLocked && (
        <div className="flex h-screen overflow-hidden">
          <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} onLock={() => setIsLocked(true)} isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} isMobileOpen={isMobileMenuOpen} setIsMobileOpen={setIsMobileMenuOpen} />
          <main className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
            <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20 shadow-sm">
              <div className="flex items-center gap-4">
                <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-500"><Menu size={24} /></button>
                <h2 className="text-lg font-semibold text-gray-900 truncate">{getSectionTitle()}</h2>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleImportClick} className="flex items-center gap-2 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-sm font-medium shadow-sm"><FileUp size={16} /><span className="hidden sm:inline">Import</span></button>
                <Dropdown trigger={<button className="flex items-center gap-2 bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 text-sm font-medium shadow-sm"><FileDown size={16} /><span className="hidden sm:inline">Export</span></button>} items={[{ label: 'Export Section', onClick: handleExportCurrent }, { label: 'Export All', onClick: handleExportAll }]} />
              </div>
            </header>
            <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#F9FAFB]">
              <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <h3 className="text-3xl font-extrabold text-gray-900 mb-2">Vault Explorer</h3>
                    <p className="text-gray-500 font-medium">Manage your {getSectionTitle().toLowerCase()} with ease.</p>
                  </div>
                  <button onClick={openAddModal} className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 shadow-xl shadow-blue-200 font-bold">
                    <Plus size={20} /> New Record
                  </button>
                </div>
                {renderContent()}
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default App;

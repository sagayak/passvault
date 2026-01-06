
import React from 'react';
import { MoreVertical, Edit, Trash2, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { InsuranceEntry } from '../types';
import { Dropdown } from './UI';

interface InsuranceTableProps {
  entries: InsuranceEntry[];
  onDelete: (id: string) => void;
  onEdit: (entry: InsuranceEntry) => void;
  onTogglePaid: (entry: InsuranceEntry) => void;
}

const InsuranceRow: React.FC<{ 
  entry: InsuranceEntry; 
  onDelete: (id: string) => void;
  onEdit: (entry: InsuranceEntry) => void;
  onTogglePaid: (entry: InsuranceEntry) => void;
}> = ({ entry, onDelete, onEdit, onTogglePaid }) => {
  const dueDate = new Date(entry.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isPastDue = dueDate < today;
  
  // Row background is red if NOT paid (regardless of date) as per "if not paid make it red"
  // But usually, we only want bright red if it's past due. 
  // Following prompt strictly: "if not paid make it red"
  const rowBgClass = !entry.isPaid ? 'bg-red-50' : 'bg-white';
  const dateTextClass = (isPastDue && !entry.isPaid) ? 'text-red-700 font-bold' : 'text-gray-700';

  return (
    <tr className={`border-b border-gray-100 hover:bg-gray-50/80 transition-colors ${rowBgClass}`}>
      <td className="py-4 px-4 font-medium text-gray-900">{entry.name}</td>
      <td className={`py-4 px-4 ${dateTextClass}`}>
        <div className="flex items-center gap-2">
          {entry.dueDate}
          {isPastDue && !entry.isPaid && <AlertCircle size={14} className="text-red-600 animate-pulse" />}
        </div>
        {isPastDue && !entry.isPaid && (
          <span className="text-[10px] font-bold text-red-600 block uppercase mt-0.5">
            Past Due
          </span>
        )}
      </td>
      <td className="py-4 px-4 text-gray-900 font-mono font-semibold">{entry.premium}</td>
      <td className="py-4 px-4">
        <button
          onClick={() => onTogglePaid(entry)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase transition-all shadow-sm ${
            entry.isPaid 
              ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200' 
              : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-700 border border-gray-200'
          }`}
        >
          {entry.isPaid ? (
            <><CheckCircle2 size={14} /> Paid</>
          ) : (
            <><XCircle size={14} /> Not Paid</>
          )}
        </button>
      </td>
      <td className="py-4 px-4 text-right">
        <Dropdown
          trigger={
            <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
              <MoreVertical size={18} />
            </button>
          }
          items={[
            { label: 'Edit', icon: <Edit size={14} />, onClick: () => onEdit(entry) },
            { label: 'Delete', icon: <Trash2 size={14} className="text-red-500" />, onClick: () => onDelete(entry.id) },
          ]}
        />
      </td>
    </tr>
  );
};

export const InsuranceTable: React.FC<InsuranceTableProps> = ({ entries, onDelete, onEdit, onTogglePaid }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
          <tr>
            <th className="py-3 px-4">Policy / Service</th>
            <th className="py-3 px-4">Due Date</th>
            <th className="py-3 px-4">Premium</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-8 text-center text-gray-400">
                No insurance policies found.
              </td>
            </tr>
          ) : (
            entries.map((entry) => (
              <InsuranceRow 
                key={entry.id} 
                entry={entry} 
                onDelete={onDelete} 
                onEdit={onEdit} 
                onTogglePaid={onTogglePaid}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

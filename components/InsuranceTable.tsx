
import React from 'react';
import { MoreVertical, Edit, Trash2, AlertCircle } from 'lucide-react';
import { InsuranceEntry } from '../types';
import { Dropdown } from './UI';

interface InsuranceTableProps {
  entries: InsuranceEntry[];
  onDelete: (id: string) => void;
  onEdit: (entry: InsuranceEntry) => void;
}

const InsuranceRow: React.FC<{ 
  entry: InsuranceEntry; 
  onDelete: (id: string) => void;
  onEdit: (entry: InsuranceEntry) => void;
}> = ({ entry, onDelete, onEdit }) => {
  const dueDate = new Date(entry.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const oneMonthFromNow = new Date();
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

  const isPastDue = dueDate < today;
  const isDueSoon = dueDate >= today && dueDate <= oneMonthFromNow;

  // Visual classes based on status
  const rowBgClass = isPastDue ? 'bg-red-50' : isDueSoon ? 'bg-orange-50/30' : '';
  const dateTextClass = isPastDue ? 'text-red-700' : isDueSoon ? 'text-orange-700' : 'text-gray-700';

  return (
    <tr className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${rowBgClass}`}>
      <td className="py-4 px-4 font-medium text-gray-900">{entry.name}</td>
      <td className={`py-4 px-4 font-semibold ${dateTextClass}`}>
        <div className="flex items-center gap-2">
          {entry.dueDate}
          {isPastDue && <AlertCircle size={14} className="text-red-600 animate-pulse" />}
          {!isPastDue && isDueSoon && <AlertCircle size={14} className="text-orange-500" />}
        </div>
        {isPastDue && (
          <span className="text-[10px] font-bold text-red-600 block uppercase mt-0.5">
            Past Due
          </span>
        )}
        {!isPastDue && isDueSoon && (
          <span className="text-[10px] font-bold text-orange-600 block uppercase mt-0.5">
            Due Soon
          </span>
        )}
      </td>
      <td className="py-4 px-4 text-gray-900 font-mono">{entry.premium}</td>
      <td className="py-4 px-4 text-gray-500 italic text-xs max-w-xs truncate" title={entry.comments}>
        {entry.comments || '-'}
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

export const InsuranceTable: React.FC<InsuranceTableProps> = ({ entries, onDelete, onEdit }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
          <tr>
            <th className="py-3 px-4">Insurance / Service</th>
            <th className="py-3 px-4">Due Date</th>
            <th className="py-3 px-4">Premium</th>
            <th className="py-3 px-4">Comments</th>
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
              <InsuranceRow key={entry.id} entry={entry} onDelete={onDelete} onEdit={onEdit} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

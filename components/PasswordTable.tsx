
import React from 'react';
import { Eye, EyeOff, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { PasswordEntry } from '../types';
import { Dropdown } from './UI';

interface PasswordTableProps {
  entries: PasswordEntry[];
  onDelete: (id: string) => void;
  onEdit: (entry: PasswordEntry) => void;
}

const PasswordRow: React.FC<{ 
  entry: PasswordEntry; 
  onDelete: (id: string) => void;
  onEdit: (entry: PasswordEntry) => void;
}> = ({ entry, onDelete, onEdit }) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
      <td className="py-4 px-4 font-medium text-gray-900">{entry.service}</td>
      <td className="py-4 px-4 text-gray-600">{entry.username}</td>
      <td className="py-4 px-4 font-mono">
        <div className="flex items-center gap-2">
          <span>{showPassword ? entry.password : '••••••••••••'}</span>
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="p-1 hover:bg-gray-200 rounded-md text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
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

export const PasswordTable: React.FC<PasswordTableProps> = ({ entries, onDelete, onEdit }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
          <tr>
            <th className="py-3 px-4">Service</th>
            <th className="py-3 px-4">Username / Email</th>
            <th className="py-3 px-4">Password</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-8 text-center text-gray-400">
                No entries found.
              </td>
            </tr>
          ) : (
            entries.map((entry) => (
              <PasswordRow key={entry.id} entry={entry} onDelete={onDelete} onEdit={onEdit} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

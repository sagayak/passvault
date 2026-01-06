
import React from 'react';
import { CarFront, Bike, MoreVertical, Edit, Trash2, Calendar } from 'lucide-react';
import { VehicleEntry } from '../types';
import { Dropdown, Progress } from './UI';

interface MiscellaneousGridProps {
  entries: VehicleEntry[];
  onDelete: (id: string) => void;
  onEdit: (vehicle: VehicleEntry) => void;
}

const VehicleCard: React.FC<{ 
  vehicle: VehicleEntry; 
  onDelete: (id: string) => void;
  onEdit: (vehicle: VehicleEntry) => void;
}> = ({ vehicle, onDelete, onEdit }) => {
  const lastDate = new Date(vehicle.lastService);
  const nextDate = new Date(vehicle.nextService);
  const today = new Date();
  
  // Calculate progress: (current - start) / (end - start)
  const totalDuration = nextDate.getTime() - lastDate.getTime();
  const elapsed = today.getTime() - lastDate.getTime();
  const progressPercent = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            {vehicle.type === 'Car' ? <CarFront size={24} /> : <Bike size={24} />}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{vehicle.name}</h3>
            <span className="text-xs text-gray-500 uppercase tracking-wider">{vehicle.type}</span>
          </div>
        </div>
        <Dropdown
          trigger={
            <button className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600">
              <MoreVertical size={18} />
            </button>
          }
          items={[
            { label: 'Edit', icon: <Edit size={14} />, onClick: () => onEdit(vehicle) },
            { label: 'Delete', icon: <Trash2 size={14} className="text-red-500" />, onClick: () => onDelete(vehicle.id) },
          ]}
        />
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 mb-1 flex items-center gap-1">
              <Calendar size={12} /> Last Service
            </p>
            <p className="font-medium">{lastDate.toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1 flex items-center gap-1">
              <Calendar size={12} /> Next Due
            </p>
            <p className="font-medium text-orange-600">{nextDate.toLocaleDateString()}</p>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>Service Progress</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} />
        </div>
      </div>
    </div>
  );
};

export const MiscellaneousGrid: React.FC<MiscellaneousGridProps> = ({ entries, onDelete, onEdit }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {entries.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} onDelete={onDelete} onEdit={onEdit} />
      ))}
      {entries.length === 0 && (
        <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
          No vehicles registered.
        </div>
      )}
    </div>
  );
};

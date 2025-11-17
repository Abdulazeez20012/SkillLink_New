import { useState } from 'react';
import { FileText } from 'lucide-react';

export default function StudentAssignments() {
  const [assignments] = useState([]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
        <p className="mt-2 text-gray-600">View and submit your assignments</p>
      </div>

      {assignments.length === 0 ? (
        <div className="card text-center py-12">
          <FileText className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
          <p className="text-gray-600">Check back later for new assignments</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {/* Assignment list will go here */}
        </div>
      )}
    </div>
  );
}

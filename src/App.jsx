import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Search, Folder, User, Check, X } from 'lucide-react';

const App = () => {
  const [openItems, setOpenItems] = useState({ 'ArchiveRoom 1 S7': true });
  const [selectedLocation, setSelectedLocation] = useState('Shelf 1');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [showUnarchiveDialog, setShowUnarchiveDialog] = useState(false);
  const [targetLocation, setTargetLocation] = useState('');
  const [message, setMessage] = useState('');
  const [transferReason, setTransferReason] = useState('');
  const [unarchiveReason, setUnarchiveReason] = useState('');

  // Initial dummy data for all locations
  const initialTableDataMap = {
    'Fridge 1': [
      { id: 'FR-20250723-001', objectType: 'Specimen', date: '07/23/2025 10:05 AM', location: 'Fridge 1' },
      { id: 'FR-20250723-002', objectType: 'Block', date: '07/23/2025 10:10 AM', location: 'Fridge 1' },
      { id: 'FR-20250723-003', objectType: 'Slide', date: '07/23/2025 10:15 AM', location: 'Fridge 1' },
      { id: 'FR-20250723-004', objectType: 'Specimen', date: '07/23/2025 10:20 AM', location: 'Fridge 1' },
    ],
    'Shelf 1': [
      { id: 'SM-123450009321-1', objectType: 'Specimen', date: '07/23/2025 11:59 AM', location: 'Shelf 1' },
      { id: 'SM-123450009321-1A', objectType: 'Block', date: '07/23/2025 11:59 AM', location: 'Shelf 1' },
      { id: 'SM-123450009321-1A 1', objectType: 'Slide', date: '07/23/2025 11:59 AM', location: 'Shelf 1' },
      { id: 'SM-123450009321-1A 2', objectType: 'Slide', date: '07/23/2025 11:59 AM', location: 'Shelf 1' },
      { id: 'SM-123450009321-2', objectType: 'Specimen', date: '07/23/2025 11:59 AM', location: 'Shelf 1' },
      { id: 'SM-123450009321-2A', objectType: 'Block', date: '07/23/2025 11:59 AM', location: 'Shelf 1' },
      { id: 'SM-123450009321-2A 1', objectType: 'Slide', date: '07/23/2025 11:59 AM', location: 'Shelf 1' },
    ],
    'Shelf 2': [
      { id: 'SH2-A-01', objectType: 'Block', date: '07/23/2025 12:30 PM', location: 'Shelf 2' },
      { id: 'SH2-A-02', objectType: 'Block', date: '07/23/2025 12:45 PM', location: 'Shelf 2' },
    ],
    'ArchiveRoom 2 N8': [
      { id: 'AR2-B-01', objectType: 'Specimen', date: '07/22/2025 09:00 AM', location: 'ArchiveRoom 2 N8' },
      { id: 'AR2-B-02', objectType: 'Specimen', date: '07/22/2025 09:10 AM', location: 'ArchiveRoom 2 N8' },
      { id: 'AR2-B-03', objectType: 'Slide', date: '07/22/2025 09:20 AM', location: 'ArchiveRoom 2 N8' },
    ],
    'Histobot': [
      { id: 'HB-X-123', objectType: 'Block', date: '07/20/2025 03:00 PM', location: 'Histobot' },
      { id: 'HB-X-124', objectType: 'Slide', date: '07/20/2025 03:15 PM', location: 'Histobot' },
      { id: 'HB-X-125', objectType: 'Specimen', date: '07/20/2025 03:20 PM', location: 'Histobot' },
    ],
    'Archive Basement': [
      { id: 'AB-Z-999', objectType: 'Specimen', date: '07/19/2025 08:00 AM', location: 'Archive Basement' },
      { id: 'AB-Z-998', objectType: 'Block', date: '07/19/2025 08:15 AM', location: 'Archive Basement' },
    ],
  };

  const [tableDataMap, setTableDataMap] = useState(initialTableDataMap);

  // Clear selected items whenever the location changes
  useEffect(() => {
    setSelectedItems([]);
  }, [selectedLocation]);

  // Clear message after a few seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const toggleOpen = (item) => {
    setOpenItems(prev => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const toggleSelect = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };
  
  const openTransferDialog = () => {
    if (selectedItems.length > 0) {
      setShowTransferDialog(true);
      setTransferReason(''); // Reset reason when opening
    }
  };

  const openUnarchiveDialog = () => {
    if (selectedItems.length > 0) {
      setShowUnarchiveDialog(true);
      setUnarchiveReason(''); // Reset reason when opening
    }
  };

  const handleTransfer = () => {
    if (!targetLocation || targetLocation === selectedLocation) {
      setMessage('Please select a valid destination location.');
      return;
    }

    if (!transferReason) {
      setMessage('Please select a reason for the transfer.');
      return;
    }

    const itemsToTransfer = tableDataMap[selectedLocation].filter(item => selectedItems.includes(item.id));

    // Update the tableDataMap by removing items from source and adding to destination
    setTableDataMap(prevMap => {
      const newMap = { ...prevMap };
      newMap[selectedLocation] = newMap[selectedLocation].filter(item => !selectedItems.includes(item.id));
      newMap[targetLocation] = [...(newMap[targetLocation] || []), ...itemsToTransfer.map(item => ({...item, location: targetLocation}))];
      return newMap;
    });

    // Reset state after transfer
    setSelectedItems([]);
    setTargetLocation('');
    setShowTransferDialog(false);
    setMessage(`Successfully transferred ${itemsToTransfer.length} item(s) to ${targetLocation}. Reason: ${transferReason}`);
  };

  const handleUnarchive = () => {
    if (!unarchiveReason) {
      setMessage('Please select a reason for the unarchive.');
      return;
    }

    setTableDataMap(prevMap => {
      const newMap = { ...prevMap };
      newMap[selectedLocation] = newMap[selectedLocation].filter(item => !selectedItems.includes(item.id));
      return newMap;
    });

    // Reset state after unarchive
    setSelectedItems([]);
    setShowUnarchiveDialog(false);
    setMessage(`Successfully unarchived ${selectedItems.length} item(s). Reason: ${unarchiveReason}`);
  };

  const sidebarData = [
    {
      name: 'ArchiveRoom 1 S7',
      items: [
        { name: 'Fridge 1' },
        { name: 'Shelf 1' },
        { name: 'Shelf 2' },
      ],
    },
    { name: 'ArchiveRoom 2 N8' },
    { name: 'Histobot' },
    { name: 'Archive Basement' },
  ];

  const reasons = ['Pathologist request', 'Error', 'Follow-up', 'Case re-opened'];

  // Helper function to get the count for a location
  const getCount = (locationName) => {
    return (tableDataMap[locationName] || []).length;
  };
  
  // Helper function to get the capacity for a location
  const getCapacity = () => 50;
  
  // Helper function to calculate the total count/capacity for a parent item
  const getTotalCountAndCapacity = (parentName) => {
    const parent = sidebarData.find(item => item.name === parentName);
    if (!parent || !parent.items) return { count: 0, capacity: 0 };
    
    let totalCount = 0;
    let totalCapacity = 0;
    parent.items.forEach(item => {
      totalCount += getCount(item.name);
      totalCapacity += getCapacity();
    });
    return { count: totalCount, capacity: totalCapacity };
  };

  const currentTableData = tableDataMap[selectedLocation] || [];
  const allLocations = Object.keys(tableDataMap);

  return (
    <div className="flex flex-col h-screen font-sans bg-gray-100 text-gray-800 relative">
      {/* Toast Message */}
      {message && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 p-4 rounded-lg shadow-lg text-white bg-green-500 z-50 transition-opacity duration-300">
          <p>{message}</p>
        </div>
      )}

      {/* Top Navbar */}
      <nav className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center space-x-4">
          <img src="https://navifyportal.roche.com/assets/icons/navify_Logo_Green_RGB_11.22.svg" alt="Navifly Logo" className="h-6" />
          <span className="text-xl font-semibold text-gray-900">Pathology Lab Advantage</span>
          <span className="text-sm text-gray-500 hidden md:block">| Archive locations</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">1:28 PM | 06/08/2024</span>
          <div className="p-1 border border-gray-200 rounded-full">
            <User size={18} className="text-gray-500" />
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white p-4 border-r border-gray-200 overflow-y-auto hidden md:block">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search or scan to add items"
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <nav className="space-y-1">
            {sidebarData.map((item) => {
              const { count, capacity } = item.items ? getTotalCountAndCapacity(item.name) : { count: getCount(item.name), capacity: getCapacity() };
              return (
                <div key={item.name}>
                  <div
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
                      item.name === selectedLocation ? 'bg-blue-100' : ''
                    }`}
                    onClick={() => {
                      toggleOpen(item.name);
                      if (!item.items) {
                        setSelectedLocation(item.name);
                      }
                    }}
                  >
                    <div className="flex items-center">
                      {item.items ? (
                        openItems[item.name] ? (
                          <ChevronDown size={16} className="text-gray-500 mr-2" />
                        ) : (
                          <ChevronRight size={16} className="text-gray-500 mr-2" />
                        )
                      ) : (
                        <Folder size={16} className="text-gray-500 mr-2" />
                      )}
                      <span className={`text-sm font-medium ${item.name === selectedLocation ? 'text-blue-700' : 'text-gray-900'}`}>{item.name}</span>
                    </div>
                    {item.items && (
                      <span className={`text-xs px-2 py-1 rounded-full ${item.name === selectedLocation ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                        {count}/{capacity}
                      </span>
                    )}
                  </div>
                  {item.items && openItems[item.name] && (
                    <ul className="pl-6 space-y-1 mt-1">
                      {item.items.map((subItem) => {
                        const subCount = getCount(subItem.name);
                        const subCapacity = getCapacity();
                        return (
                          <li
                            key={subItem.name}
                            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
                              subItem.name === selectedLocation ? 'bg-blue-100' : ''
                            }`}
                            onClick={() => setSelectedLocation(subItem.name)}
                          >
                            <span className={`text-sm ${subItem.name === selectedLocation ? 'text-blue-700' : 'text-gray-900'}`}>{subItem.name}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              subItem.name === selectedLocation ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                            }`}>
                              {subCount}/{subCapacity}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main Panel */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Header section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h1 className="text-2xl font-bold">Specimen Archive</h1>
              <p className="mt-1 text-gray-500">
                <span className="font-semibold text-gray-700">{selectedLocation}</span>
                <span className="mx-2">|</span>
                {selectedLocation === 'Shelf 1' ? 'Fridge 2 Bottom Shelf - specimens only' : `Details for ${selectedLocation}`}
              </p>
              <div className="flex items-center space-x-6 mt-4 text-sm text-gray-600">
                <span>Total capacity: <span className="font-semibold text-gray-800">{getCapacity()}</span></span>
                <span>Total items stored: <span className="font-semibold text-gray-800">{currentTableData.length}</span></span>
              </div>
            </div>

            {/* Table section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="py-3 px-2 w-12">
                      <input
                        type="checkbox"
                        className="rounded text-blue-500 focus:ring-blue-400"
                        checked={selectedItems.length > 0 && selectedItems.length === currentTableData.length}
                        onChange={() => {
                          if (selectedItems.length > 0) {
                            setSelectedItems([]);
                          } else {
                            setSelectedItems(currentTableData.map(item => item.id));
                          }
                        }}
                      />
                    </th>
                    <th className="py-3 px-2">Accessioning ID <span className="text-gray-400 ml-1">&#9660;</span></th>
                    <th className="py-3 px-2">Object type</th>
                    <th className="py-3 px-2">Date archived <span className="text-gray-400 ml-1">&#9660;</span></th>
                    <th className="py-3 px-2">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentTableData.map((item) => (
                    <tr key={item.id} className="text-sm text-gray-700 hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <input
                          type="checkbox"
                          className="rounded text-blue-500 focus:ring-blue-400"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleSelect(item.id)}
                        />
                      </td>
                      <td className="py-3 px-2 font-mono text-xs">{item.id}</td>
                      <td className="py-3 px-2">{item.objectType}</td>
                      <td className="py-3 px-2">{item.date}</td>
                      <td className="py-3 px-2">{item.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={openUnarchiveDialog}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm ${selectedItems.length > 0 ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                  disabled={selectedItems.length === 0}
                >
                  <X size={16} className="mr-2" />Unarchive
                </button>
                <button
                  onClick={openTransferDialog}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm ${selectedItems.length > 0 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-300 text-white cursor-not-allowed'}`}
                  disabled={selectedItems.length === 0}
                >
                  <ChevronRight size={16} className="mr-2" />Transfer
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Transfer Dialog */}
      {showTransferDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-lg font-bold mb-4">Transfer {selectedItems.length} Item(s)</h3>
            <p className="text-sm text-gray-600 mb-4">
              Select a destination location and reason for the transfer.
            </p>
            <div className="mb-4">
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
                Destination:
              </label>
              <select
                id="destination"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={targetLocation}
                onChange={(e) => setTargetLocation(e.target.value)}
              >
                <option value="">Select a location</option>
                {allLocations.filter(loc => loc !== selectedLocation).map(loc => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label htmlFor="transfer-reason" className="block text-sm font-medium text-gray-700 mb-1">
                Reason:
              </label>
              <select
                id="transfer-reason"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={transferReason}
                onChange={(e) => setTransferReason(e.target.value)}
              >
                <option value="">Select a reason</option>
                {reasons.map(reason => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowTransferDialog(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleTransfer}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm ${targetLocation && transferReason ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'}`}
                disabled={!targetLocation || !transferReason}
              >
                Confirm Transfer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unarchive Dialog */}
      {showUnarchiveDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-lg font-bold mb-4">Unarchive Items</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to unarchive the selected {selectedItems.length} item(s)? This action cannot be undone.
            </p>
            <div className="mb-6">
              <label htmlFor="unarchive-reason" className="block text-sm font-medium text-gray-700 mb-1">
                Reason:
              </label>
              <select
                id="unarchive-reason"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={unarchiveReason}
                onChange={(e) => setUnarchiveReason(e.target.value)}
              >
                <option value="">Select a reason</option>
                {reasons.map(reason => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowUnarchiveDialog(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUnarchive}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm ${unarchiveReason ? 'bg-red-600 hover:bg-red-700' : 'bg-red-300 cursor-not-allowed'}`}
                disabled={!unarchiveReason}
              >
                Confirm Unarchive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

/*
const items = [
    { Id: 4, Name: 'Developement CAD' },
    { Id: 5, Name: 'FM Hosting' },
    ]
*/

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function MyTable({ records, setRecords, items }) {
    const [newItem, setNewItem] = useState({ item: '', rate: '', qty: 1, total: 0 });
    console.log('items',items)

    const handleItemChange = (selectedItemName) => {
        const selectedItem = items.find(item => item.Name === selectedItemName);
        const selectedRate = selectedItem ? selectedItem.Rate : '';
        setNewItem({ ...newItem, item: selectedItemName, rate: selectedRate });
    };

    const addToInvoice = () => {
        if (!newItem.item || newItem.item === 'Select Item') {
            alert('Please select an item.');
            return; // Exit the function early
        }
    
        // Check if the rate is null or 0
        if (!newItem.rate || parseFloat(newItem.rate) === 0) {
            alert('Please enter a valid rate.');
            return; // Exit the function early
        }
    
        // Check if the quantity is null or 0
        if (!newItem.qty || parseInt(newItem.qty) === 0) {
            alert('Please enter a valid quantity.');
            return; // Exit the function early
        }

        // Assuming 'items' is accessible here and contains the items you showed
        const selectedItem = items.find(item => item.Name === newItem.item);
    
        // If selectedItem is undefined, it means the newItem.item doesn't match any item from your items array
        if (!selectedItem) {
            console.error("Selected item not found in items array.");
            return; // Exit the function early
        }
    
        // Construct the new record with all needed properties
        const newRecord = {
            Id: selectedItem.Id, // Use the Id from the selectedItem
            Name: newItem.item,  // Use the Name from the newItem
            Rate: newItem.rate,  // Use the Rate from the newItem
            Qty: newItem.qty,    // Use the Qty from the newItem
            Total: (parseFloat(newItem.rate) * parseInt(newItem.qty)).toFixed(2) // Calculate the total
        };
    
        setRecords([...records, newRecord]);
        setNewItem({ item: '', rate: '', qty: 1, total: 0 }); // Reset inputs after adding
    };
    
    const sendToFileMaker = () => {
        const obj = {records}
        FileMaker.PerformScript("webViewer . callbacks", JSON.stringify(obj));
    };
    

    useEffect(() => {
        setNewItem({ ...newItem, total: (newItem.rate * newItem.qty).toFixed(2) });
    }, [newItem.rate, newItem.qty]);

    const deleteRow = (Id) => {
        // a function to remove item from reacords
    };

    const onDragEnd = (result) => {
        const { destination, source } = result;
        if (!destination) {
            return;
        }
        const reorderedRecords = Array.from(records);
        const [removed] = reorderedRecords.splice(source.index, 1);
        reorderedRecords.splice(destination.index, 0, removed);
    
        setRecords(reorderedRecords);
    };

    return (
        <div className="grow overflow-x-auto h-full">
            <div className="inline-block min-w-full align-middle h-full">
                <div id="tableWrapper" className="shadow ring-1 ring-black ring-opacity-5 h-full">
                    <div className="min-w-full divide-y divide-gray-300 h-full">
                        <div className="flex flex-row justify-center bg-gray-100 p-5">
                            <div className="w-1/5 flex justify-center">Item</div>
                            <div className="w-1/5 flex justify-center">Rate</div>
                            <div className="w-1/5 flex justify-center">Qty</div>
                            <div className="w-1/5 flex justify-center">Total</div>
                            <div className="w-1/5 flex justify-center"></div>
                        </div>
                        <div className="flex flex-row justify-center p-5">
                            <select 
                                className="select-style"
                                value={newItem.item} 
                                onChange={(e) => handleItemChange(e.target.value)}>
                                <option value="">Select Item</option>
                                {items.map(item => (
                                    <option key={item.Id} value={item.Name}>{item.Name}</option>
                                ))}
                            </select>
                            <input className="input-style" type="number" value={newItem.rate} onChange={(e) => setNewItem({ ...newItem, rate: e.target.value })} />
                            <input className="input-style" type="number" value={newItem.qty} min="1" onChange={(e) => setNewItem({ ...newItem, qty: e.target.value })} />
                            <div className="w-1/5 flex items-center justify-center">${newItem.total}</div>
                            <button 
                                className="w-1/5 flex items-center justify-center bg-slate-500 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                                onClick={addToInvoice}>Add to Invoice
                            </button>
                        </div>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="invoiceItems">
                                {(provided) => (
                                    <section {...provided.droppableProps} ref={provided.innerRef} className="divide-y divide-gray-200 bg-white overflow-y-auto">
                                        {(records || []).map((record, index) => (
                                            <Draggable key={record.Id} draggableId={record.Id.toString()} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="flex flex-row justify-between bg-gray-50 p-4"
                                                    >
                                                        {/* Your record content here */}
                                                        <div className="w-1/5 flex items-center justify-center">{record.Name}</div>
                                                        <div className="w-1/5 flex items-center justify-center">${record.Rate}</div>
                                                        <div className="w-1/5 flex items-center justify-center">{record.Qty}</div>
                                                        <div className="w-1/5 flex items-center justify-center">${record.Total}</div>
                                                        <div className="w-1/5 flex items-center justify-center"></div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </section>
                                )}
                            </Droppable>
                        </DragDropContext>
                        {records.length > 0 && ( // Conditional rendering based on the length of the records array
                            <div className="flex justify-start p-5">
                                <button
                                    className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out"
                                    onClick={() => sendToFileMaker()}
                                >
                                    Create Invoice
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

import React, { useState } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { GripVertical, Receipt, Wallet } from 'lucide-react';

function DraggableItem({ id, item }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
    data: { item }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="touch-none bg-zinc-800 p-4 mb-3 rounded-xl flex items-center justify-between shadow-lg border border-zinc-700 active:scale-105 transition-transform z-50 cursor-grab active:cursor-grabbing">
      <div className="flex items-center gap-3">
        <div className="bg-orange-500/20 p-2 rounded-lg text-orange-500">
          <Receipt size={20} />
        </div>
        <div>
          <p className="font-bold">{item.name}</p>
          <p className="text-xs text-zinc-400">Ziehen zum Zuweisen</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono font-bold text-lg">{item.price}€</span>
        <GripVertical className="text-zinc-600" />
      </div>
    </div>
  );
}

function PersonDroppable({ id, person }) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div ref={setNodeRef} className={`flex flex-col items-center p-4 rounded-2xl transition-all duration-200 ${isOver ? 'bg-green-500/20 ring-2 ring-green-500 scale-110' : 'bg-zinc-900'}`}>
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mb-2 flex items-center justify-center text-xl font-bold border-2 border-zinc-800 shadow-xl relative">
        {person.name.charAt(0)}
        {isOver && <div className="absolute inset-0 rounded-full bg-green-500/30 animate-pulse" />}
      </div>
      <span className="font-medium text-sm mb-1">{person.name}</span>
      <span className={`text-xs font-mono py-1 px-2 rounded-full transition-colors ${person.total > 0 ? 'bg-green-500 text-black font-bold' : 'bg-zinc-800 text-zinc-500'}`}>
        {person.total.toFixed(2)}€
      </span>
    </div>
  );
}

export default function App() {
  const [items, setItems] = useState([
    { id: 'item-1', name: 'Raclette Käse', price: 12.99 },
    { id: 'item-2', name: 'Rotwein', price: 8.50 },
    { id: 'item-3', name: 'Baguette', price: 2.20 },
    { id: 'item-4', name: 'Gin', price: 24.90 },
  ]);

  const [people, setPeople] = useState([
    { id: 'user-1', name: 'Lukas', total: 0 },
    { id: 'user-2', name: 'Anna', total: 0 },
    { id: 'user-3', name: 'Tom', total: 0 },
  ]);

  function handleDragEnd(event) {
    const { active, over } = event;
    if (over && active.data.current) {
      const itemPrice = active.data.current.item.price;
      setPeople((prev) => prev.map(person => 
        person.id === over.id ? { ...person, total: person.total + itemPrice } : person
      ));
      setItems((prev) => prev.filter(item => item.id !== active.id));
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 max-w-md mx-auto flex flex-col font-sans select-none">
      <header className="flex justify-between items-center mb-8 pt-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-600 tracking-tight">FairShare</h1>
          <p className="text-zinc-500 text-sm font-medium">Silvester Party '25</p>
        </div>
        <div className="bg-zinc-900 p-3 rounded-full border border-zinc-800 shadow-inner">
          <Wallet size={24} className="text-zinc-400" />
        </div>
      </header>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="mb-8">
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 ml-1">Teilnehmer</h2>
          <div className="grid grid-cols-3 gap-3">
            {people.map(person => (
              <PersonDroppable key={person.id} id={person.id} person={person} />
            ))}
          </div>
        </div>

        <div className="flex-1">
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 ml-1">Offene Posten ({items.length})</h2>
          <div className="space-y-2 pb-20">
            {items.length === 0 ? (
              <div className="text-center py-16 text-zinc-600 border-2 border-dashed border-zinc-900 rounded-2xl">Alles verteilt! 🎉</div>
            ) : (
              items.map(item => (
                <DraggableItem key={item.id} id={item.id} item={item} />
              ))
            )}
          </div>
        </div>
      </DndContext>
    </div>
  );
}
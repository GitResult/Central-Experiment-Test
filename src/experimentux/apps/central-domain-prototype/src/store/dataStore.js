/**
 * Data Store
 * Zustand store for contacts, tasks, and pages data
 */

import { create } from 'zustand';
import contactsData from '../data/contacts.json';
import tasksData from '../data/tasks.json';

export const useDataStore = create((set, get) => ({
  // Contacts state
  contacts: contactsData,

  // Tasks state
  tasks: tasksData,

  // Recently viewed items
  recentlyViewed: [],

  // Actions for contacts
  getContactById: (id) => {
    return get().contacts.find(contact => contact.id === id);
  },

  addContact: (contact) => {
    set((state) => ({
      contacts: [...state.contacts, { ...contact, id: `contact-${Date.now()}`, createdAt: new Date().toISOString() }]
    }));
  },

  updateContact: (id, updates) => {
    set((state) => ({
      contacts: state.contacts.map(contact =>
        contact.id === id ? { ...contact, ...updates } : contact
      )
    }));
  },

  deleteContact: (id) => {
    set((state) => ({
      contacts: state.contacts.filter(contact => contact.id !== id)
    }));
  },

  // Actions for tasks
  getTaskById: (id) => {
    return get().tasks.find(task => task.id === id);
  },

  addTask: (task) => {
    set((state) => ({
      tasks: [...state.tasks, { ...task, id: `task-${Date.now()}`, createdAt: new Date().toISOString() }]
    }));
  },

  updateTask: (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map(task =>
        task.id === id ? { ...task, ...updates } : task
      )
    }));
  },

  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter(task => task.id !== id)
    }));
  },

  // Actions for recently viewed
  addRecentlyViewed: (item) => {
    set((state) => {
      // Remove if already exists
      const filtered = state.recentlyViewed.filter(viewed =>
        !(viewed.type === item.type && viewed.id === item.id)
      );

      // Add to beginning, keep only last 5
      return {
        recentlyViewed: [{ ...item, viewedAt: new Date().toISOString() }, ...filtered].slice(0, 5)
      };
    });
  },

  clearRecentlyViewed: () => {
    set({ recentlyViewed: [] });
  }
}));

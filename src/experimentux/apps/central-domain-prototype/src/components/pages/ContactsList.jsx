/**
 * ContactsList Component
 * Grid view of all contacts with sorting, filtering, and search
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDataStore } from '../../store/dataStore';
import { useEditablePage } from '../../utils/makePageEditable';
import { theme } from '../../config/theme';

export function ContactsList() {
  const contacts = useDataStore((state) => state.contacts);
  const { renderDropZone, renderUserElements, wrapWithDndContext } = useEditablePage('contacts-list', 'Contacts');

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterTag, setFilterTag] = useState('all');

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set();
    contacts.forEach(contact => {
      contact.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [contacts]);

  // Filter and sort contacts
  const filteredContacts = useMemo(() => {
    let filtered = contacts;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(term) ||
        contact.email?.toLowerCase().includes(term) ||
        contact.company?.toLowerCase().includes(term)
      );
    }

    // Apply tag filter
    if (filterTag !== 'all') {
      filtered = filtered.filter(contact =>
        contact.tags?.includes(filterTag)
      );
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'company') {
        return (a.company || '').localeCompare(b.company || '');
      } else if (sortBy === 'date') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });

    return filtered;
  }, [contacts, searchTerm, filterTag, sortBy]);

  return wrapWithDndContext(
    <div className="max-w-7xl mx-auto p-6">
      {renderUserElements('contacts-list-main')}
      {renderDropZone('contacts-list-main')}
      {/* Header */}
      <div className="mb-6">
        <h1
          className="font-bold mb-2"
          style={{
            fontSize: theme.typography.fontSize['3xl'],
            color: theme.colors.text.primary,
            fontWeight: theme.typography.fontWeight.bold
          }}
        >
          Contacts
        </h1>
        <p
          style={{
            fontSize: theme.typography.fontSize.base,
            color: theme.colors.text.secondary
          }}
        >
          {filteredContacts.length} {filteredContacts.length === 1 ? 'contact' : 'contacts'}
        </p>
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        {/* Search */}
        <div className="flex-1 min-w-64">
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.border.default,
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.primary
            }}
          />
        </div>

        {/* Sort by */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border.default,
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.primary
          }}
        >
          <option value="name">Sort by Name</option>
          <option value="company">Sort by Company</option>
          <option value="date">Sort by Date</option>
        </select>

        {/* Filter by tag */}
        <select
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          className="px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border.default,
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.primary
          }}
        >
          <option value="all">All Tags</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>

      {/* Contacts Grid */}
      {filteredContacts.length === 0 ? (
        <div
          className="text-center py-12"
          style={{
            color: theme.colors.text.tertiary
          }}
        >
          <p>No contacts found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      )}
    </div>
  );
}

// ContactCard subcomponent
function ContactCard({ contact }) {
  return (
    <Link to={`/contacts/${contact.id}`}>
      <div
        className="rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer"
        style={{
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.border.default,
          borderRadius: theme.borderRadius.lg
        }}
      >
        {/* Avatar */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center font-semibold flex-shrink-0"
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.text.inverse,
              fontSize: theme.typography.fontSize.lg
            }}
          >
            {contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="font-semibold truncate"
              style={{
                fontSize: theme.typography.fontSize.base,
                color: theme.colors.text.primary,
                fontWeight: theme.typography.fontWeight.semibold
              }}
            >
              {contact.name}
            </h3>
            <p
              className="truncate"
              style={{
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.secondary
              }}
            >
              {contact.role}
            </p>
          </div>
        </div>

        {/* Company */}
        {contact.company && (
          <p
            className="mb-2 truncate"
            style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary
            }}
          >
            {contact.company}
          </p>
        )}

        {/* Email */}
        {contact.email && (
          <p
            className="mb-3 truncate"
            style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.tertiary
            }}
          >
            {contact.email}
          </p>
        )}

        {/* Tags */}
        {contact.tags && contact.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {contact.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 rounded text-xs"
                style={{
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text.secondary,
                  fontSize: theme.typography.fontSize.xs
                }}
              >
                {tag}
              </span>
            ))}
            {contact.tags.length > 3 && (
              <span
                className="px-2 py-1 text-xs"
                style={{
                  color: theme.colors.text.tertiary,
                  fontSize: theme.typography.fontSize.xs
                }}
              >
                +{contact.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

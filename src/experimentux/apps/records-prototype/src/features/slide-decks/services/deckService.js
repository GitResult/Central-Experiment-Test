/**
 * Deck Service
 *
 * Handles all deck-related API calls
 * Currently uses mock data, to be replaced with real API calls
 */

// Mock data storage (in-memory for prototype)
let mockDecks = [
  {
    id: 'deck-1',
    name: 'Q3 Board Deck',
    description: 'Quarterly results presentation',
    tags: ['finance', 'quarterly'],
    folderId: null,
    createdBy: 'user-1',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    modifiedAt: new Date(Date.now() - 7200000).toISOString(),
    slideOrder: ['slide-1', 'slide-2', 'slide-3'],
    slideCount: 50,
    thumbnailUrl: null,
    slides: [
      {
        id: 'slide-1',
        deckId: 'deck-1',
        position: 0,
        contentBlocks: [
          {
            id: 'block-1',
            type: 'text',
            content: 'Q3 2024 Results',
            style: { fontSize: 48, bold: true, alignment: 'center' }
          }
        ],
        layout: {
          mode: 'auto',
          positions: [],
          extraElements: []
        },
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString()
      }
    ],
    permissions: []
  },
  {
    id: 'deck-2',
    name: 'Sales Proposal - Acme Corp',
    description: 'Enterprise sales pitch',
    tags: ['sales', 'proposal'],
    folderId: null,
    createdBy: 'user-1',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    modifiedAt: new Date(Date.now() - 86400000).toISOString(),
    slideOrder: [],
    slideCount: 12,
    thumbnailUrl: null,
    slides: [],
    permissions: []
  },
  {
    id: 'deck-3',
    name: 'Bank Loan Application',
    description: 'Loan application for expansion',
    tags: ['finance', 'loan'],
    folderId: null,
    createdBy: 'user-1',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    modifiedAt: new Date(Date.now() - 259200000).toISOString(),
    slideOrder: [],
    slideCount: 8,
    thumbnailUrl: null,
    slides: [],
    permissions: []
  }
];

/**
 * List all decks (optionally filtered by folder)
 *
 * @param {string|null} folderId - Folder ID to filter by (optional)
 * @returns {Promise<Array>} Array of deck objects
 */
export const listDecks = async (folderId = null) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  let decks = mockDecks;
  if (folderId) {
    decks = decks.filter(deck => deck.folderId === folderId);
  }

  return decks.map(deck => ({
    id: deck.id,
    name: deck.name,
    description: deck.description,
    tags: deck.tags,
    slideCount: deck.slideCount,
    thumbnailUrl: deck.thumbnailUrl,
    updatedAt: deck.modifiedAt,
    createdBy: deck.createdBy
  }));
};

/**
 * Get a single deck by ID with all slides
 *
 * @param {string} deckId - Deck ID
 * @returns {Promise<Object>} Deck object with slides
 */
export const getDeck = async (deckId) => {
  await new Promise(resolve => setTimeout(resolve, 200));

  const deck = mockDecks.find(d => d.id === deckId);
  if (!deck) {
    throw new Error(`Deck not found: ${deckId}`);
  }

  return { ...deck };
};

/**
 * Create a new deck
 *
 * @param {Object} deckData - Deck data
 * @param {string} deckData.name - Deck name
 * @param {string} deckData.description - Deck description (optional)
 * @param {Array<string>} deckData.tags - Tags (optional)
 * @param {string|null} deckData.folderId - Folder ID (optional)
 * @param {string|null} deckData.templateId - Template ID to use (optional)
 * @returns {Promise<Object>} Created deck object
 */
export const createDeck = async (deckData) => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const newDeck = {
    id: `deck-${Date.now()}`,
    name: deckData.name || 'Untitled Deck',
    description: deckData.description || '',
    tags: deckData.tags || [],
    folderId: deckData.folderId || null,
    createdBy: 'user-1', // TODO: Get from auth context
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
    slideOrder: [],
    slideCount: 1,
    thumbnailUrl: null,
    slides: [
      {
        id: `slide-${Date.now()}`,
        deckId: `deck-${Date.now()}`,
        position: 0,
        contentBlocks: [],
        layout: {
          mode: 'auto',
          positions: [],
          extraElements: []
        },
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString()
      }
    ],
    permissions: []
  };

  // If template is specified, apply template content
  if (deckData.templateId) {
    // TODO: Apply template content
  }

  mockDecks.push(newDeck);
  return newDeck;
};

/**
 * Update an existing deck
 *
 * @param {string} deckId - Deck ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated deck object
 */
export const updateDeck = async (deckId, updates) => {
  await new Promise(resolve => setTimeout(resolve, 200));

  const deckIndex = mockDecks.findIndex(d => d.id === deckId);
  if (deckIndex === -1) {
    throw new Error(`Deck not found: ${deckId}`);
  }

  mockDecks[deckIndex] = {
    ...mockDecks[deckIndex],
    ...updates,
    modifiedAt: new Date().toISOString()
  };

  return mockDecks[deckIndex];
};

/**
 * Delete a deck
 *
 * @param {string} deckId - Deck ID
 * @returns {Promise<boolean>} True if deleted successfully
 */
export const deleteDeck = async (deckId) => {
  await new Promise(resolve => setTimeout(resolve, 200));

  const deckIndex = mockDecks.findIndex(d => d.id === deckId);
  if (deckIndex === -1) {
    throw new Error(`Deck not found: ${deckId}`);
  }

  mockDecks.splice(deckIndex, 1);
  return true;
};

/**
 * Get deck permissions
 *
 * @param {string} deckId - Deck ID
 * @returns {Promise<Array>} Array of permission objects
 */
export const getDeckPermissions = async (deckId) => {
  await new Promise(resolve => setTimeout(resolve, 100));

  const deck = mockDecks.find(d => d.id === deckId);
  if (!deck) {
    throw new Error(`Deck not found: ${deckId}`);
  }

  return deck.permissions || [];
};

/**
 * Update deck permissions
 *
 * @param {string} deckId - Deck ID
 * @param {Array} permissions - New permissions array
 * @returns {Promise<Array>} Updated permissions
 */
export const updateDeckPermissions = async (deckId, permissions) => {
  await new Promise(resolve => setTimeout(resolve, 200));

  const deckIndex = mockDecks.findIndex(d => d.id === deckId);
  if (deckIndex === -1) {
    throw new Error(`Deck not found: ${deckId}`);
  }

  mockDecks[deckIndex].permissions = permissions;
  return permissions;
};

export const deckService = {
  listDecks,
  getDeck,
  createDeck,
  updateDeck,
  deleteDeck,
  getDeckPermissions,
  updateDeckPermissions
};

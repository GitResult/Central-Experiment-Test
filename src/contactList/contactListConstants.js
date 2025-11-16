/**
 * Contact List Constants
 *
 * Contains constants used throughout the contact list component,
 * including location coordinates, field mappings, and icon creators.
 */

import L from 'leaflet';

// Location coordinates mapping for map visualization
export const locationCoords = {
  'California': [36.7783, -119.4179],
  'Texas': [31.9686, -99.9018],
  'Washington': [47.7511, -120.7401],
  'Oregon': [43.8041, -120.5542],
  'Colorado': [39.5501, -105.7821],
  'Unknown': [39.8283, -98.5795] // Center of US
};

/**
 * Custom marker icon creator for Leaflet maps
 * @param {number} count - Number to display in the marker
 * @returns {L.DivIcon} Leaflet div icon
 */
export const createCustomIcon = (count) => {
  return L.divIcon({
    html: `
            <div style="
                background: #6366f1;
                color: white;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 12px;
                border: 3px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ">${count}</div>
        `,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

// Field name mapping: Display name → Data field name
export const FIELD_NAME_MAP = {
  'Id': 'id',
  'Name': 'name',
  'Type': 'type',
  'Status': 'status',
  'Email': 'email',
  'Phone': 'phone',
  'Location': 'location',
  'Address Line 1': 'addressLine1',
  'Address Line 2': 'addressLine2',
  'City': 'city',
  'Province/State': 'provinceState',
  'Country': 'country',
  'Postal/Zip Code': 'postalZipCode',
  'Age': 'age',
  'Age Group': 'ageGroup',
  'Date of Birth': 'dateOfBirth',
  'Renewal Type': 'renewalType',
  'Committees': 'committees',
  'Events': 'events',
  'Join Date': 'joinDate',
  'Renewal Date': 'renewalDate',
  'Engagement': 'engagement',
  'Revenue': 'revenue',
  'Membership Level': 'membershipLevel'
};

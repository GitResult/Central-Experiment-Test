/**
 * Leaflet Map Component
 *
 * Displays a Leaflet map with markers for contact locations.
 * Prevents re-initialization by using refs to maintain map instance.
 */

import React, { useRef, useEffect } from 'react';
import L from 'leaflet';
import { locationCoords, createCustomIcon } from '../contactListConstants';

const LeafletMapComponent = ({ chartId, mapData }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    // Only initialize if we don't have a map instance yet
    if (!mapInstanceRef.current && mapContainerRef.current) {
      // Create map instance manually
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        center: [39.8283, -98.5795],
        zoom: 4,
        scrollWheelZoom: true
      });

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
      }).addTo(mapInstanceRef.current);

      // Add markers
      Object.entries(mapData).forEach(([location, count]) => {
        const coords = locationCoords[location] || locationCoords['Unknown'];
        const marker = L.marker(coords, {
          icon: createCustomIcon(count)
        }).addTo(mapInstanceRef.current);

        marker.bindPopup(`
                    <div style="text-align: center; padding: 5px;">
                        <strong>${location}</strong><br />
                        <span style="font-size: 18px; color: #6366f1;">${count}</span> member${count !== 1 ? 's' : ''}
                    </div>
                `);
      });
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [chartId, mapData]);

  return (
    <div
      ref={mapContainerRef}
      className="relative h-[300px] w-full rounded-lg overflow-hidden z-0"
      id={`leaflet-map-${chartId}`}
    />
  );
};

export default LeafletMapComponent;

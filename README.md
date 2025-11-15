# Central USB Search

A React-based unified search interface for enterprise data with advanced visualization, comparison modes, and AI-powered features.

## Project Overview

Central USB Search is a comprehensive data exploration and analysis platform built with React 18. It provides multiple specialized interfaces for different use cases, including staff management, performance analytics, record listing with markers, and AI-assisted data exploration.

## Features

- **Interactive Data Visualization**: Built-in charts, heatmaps, and radar plots using Recharts
- **Drag-and-Drop Interface**: Sortable and draggable elements using @dnd-kit
- **AI-Powered Chat**: Integrated AI assistant for data analysis and task generation
- **Marker System**: Visual markers for highlighting and tracking data points
- **Responsive Design**: Tailwind CSS for mobile-friendly layouts
- **Performance Analytics**: Real-time performance metrics and revenue tracking
- **Comparison Mode**: Side-by-side data comparison with filtering

## Tech Stack

- **React** 18.2.0 - UI framework
- **Tailwind CSS** 3.3.0 - Utility-first styling
- **Recharts** 3.3.0 - Data visualization library
- **@dnd-kit** 6.3.1 - Drag-and-drop functionality
- **Lucide React** 0.552.0 - Icon library
- **React Type Animation** 3.2.0 - Text animations

## Project Structure

```
Central-Experiment-Test/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/             # React components
│   │   ├── CompareModeDemo.js          # Main comparison interface with markers and chat
│   │   ├── StaffDetails.js             # Staff management and notes interface
│   │   ├── USBSearch.js                # Unified search with visualizations
│   │   ├── ReportPhrase.js             # Report phrase search and management
│   │   ├── PerformanceListing.js       # Performance metrics and analytics
│   │   ├── RecordListingBasic.js       # Basic record listing with markers
│   │   ├── RecordListingResizable.js   # Resizable record listing panels
│   │   └── RecordListingAdvanced.js    # Advanced listing with heatmap and AI
│   ├── App.js                  # Application entry point
│   ├── index.js               # React DOM root
│   └── index.css              # Global styles
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Tailwind configuration
└── README.md                  # This file
```

## Available Components

### CompareModeDemo
Main comparison mode interface with:
- Interactive data table
- Visual markers for highlighting records
- AI chat panel for task generation
- Draggable/sortable task management
- Pie charts and radar visualizations

### StaffDetails
Staff management interface featuring:
- Drag-and-drop notes and tasks
- Customizable dashboard widgets
- Staff information cards
- Template system

### USBSearch
Unified search interface with:
- Advanced search filters
- Multiple visualization modes (bar, line, pie charts)
- Animated search experience
- Export functionality

### ReportPhrase
Report phrase search system with:
- Phrase-based search
- Result filtering and sorting
- Quick action chips
- Analytics integration

### PerformanceListing
Performance analytics dashboard:
- Member type charts
- Revenue panels with drag/resize
- Aggregation controls
- Agent assignment system

### RecordListing Components
Three versions of record listing interfaces:
- **Basic**: Core functionality with markers
- **Resizable**: Adds resizable panels
- **Advanced**: Full-featured with heatmap and AI chat

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Central-Experiment-Test
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

## Available Scripts

### `npm start`
Runs the app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm build`
Builds the app for production to the `build` folder.
The build is optimized for best performance.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run eject`
**Note: this is a one-way operation. Once you eject, you can't go back!**

## Switching Between Components

To switch between different demo components, edit `src/App.js` and change the import:

```javascript
// Example: Switch to USBSearch
import USBSearch from './components/USBSearch';

function App() {
  return <USBSearch />;
}
```

## Development Guidelines

### Adding New Components

1. Create your component in `src/components/`
2. Follow the existing naming convention
3. Add JSDoc comments for documentation
4. Update this README with component description

### Code Style

- Use functional components with hooks
- Keep components modular and reusable
- Add comments for complex logic
- Follow React best practices

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

Private - All rights reserved

## Version History

- 1.0.0 - Initial release with core components

---

**Note**: This is an experimental project for testing and development purposes.

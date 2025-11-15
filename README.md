# Central USB Search

A React-based unified search interface for enterprise data with advanced visualization, comparison modes, and AI-powered features.

## Project Overview

Central USB Search is a comprehensive data exploration and analysis platform built with React 18. It provides multiple specialized interfaces for different use cases, including staff management, performance analytics, record listing with markers, and AI-assisted data exploration.

## Features

- **Central Navigation Hub**: Beautiful landing page to access all components with search functionality
- **Board Packet Management**: Complete board meeting solution with PDF viewing, annotations, and markers
- **Interactive Data Visualization**: Built-in charts, heatmaps, and radar plots using Recharts
- **Drag-and-Drop Interface**: Sortable and draggable elements using @dnd-kit
- **AI-Powered Chat**: Integrated AI assistant for data analysis and task generation
- **Marker System**: Visual markers for highlighting and tracking data points
- **Responsive Design**: Tailwind CSS for mobile-friendly layouts
- **Performance Analytics**: Real-time performance metrics and revenue tracking
- **Comparison Mode**: Side-by-side data comparison with filtering
- **Easy Component Switching**: Navigate between 9 different components with one click

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
│   │   ├── Navigation.js               # Central navigation hub
│   │   ├── BoardPacketPage.js          # Board meeting packet management
│   │   ├── CompareModeDemo.js          # Main comparison interface with markers and chat
│   │   ├── StaffDetails.js             # Staff management and notes interface
│   │   ├── USBSearch.js                # Unified search with visualizations
│   │   ├── ReportPhrase.js             # Report phrase search and management
│   │   ├── PerformanceListing.js       # Performance metrics and analytics
│   │   ├── RecordListingBasic.js       # Basic record listing with markers
│   │   ├── RecordListingResizable.js   # Resizable record listing panels
│   │   └── RecordListingAdvanced.js    # Advanced listing with heatmap and AI
│   ├── App.js                  # Application entry point with navigation
│   ├── index.js               # React DOM root
│   └── index.css              # Global styles
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Tailwind configuration
└── README.md                  # This file
```

## Navigation

When you run the application, you'll see a **central navigation page** that provides access to all available components. The navigation page features:

- **Grid layout** of all 9 components with descriptions
- **Search functionality** to quickly find components
- **Feature tags** highlighting key capabilities
- **One-click access** to any component
- **Back to Home button** on each component to return to navigation

Simply click on any component card to explore its features. Use the "Back to Home" button in the top-left corner to return to the navigation page.

## Available Components

### Navigation
Central hub for accessing all components:
- Grid layout with component cards
- Search and filter functionality
- Component descriptions and features
- Responsive design
- Easy navigation between all pages

### BoardPacketPage
Board meeting packet management system:
- PDF document viewing with zoom controls
- Marker overlay with normalized coordinates (survives zoom/resize)
- Document upload with conversion status tracking
- Threaded annotations and comments
- Agenda-based navigation
- Three-column layout (agenda, PDF, notes)
- Share and download packet functionality
- Meeting information management

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

## Using the Application

### Navigation
The application opens with a **central navigation page** by default. From there:

1. Browse all available components in the grid layout
2. Use the search bar to filter components by name or features
3. Click any component card to open it
4. Use the "Back to Home" button to return to navigation

### Direct Component Access (Advanced)
For development purposes, you can bypass navigation by editing `src/App.js`:

```javascript
// Change the initial state to open a specific component directly
const [currentComponent, setCurrentComponent] = useState('usb-search');
// Or set to null for navigation page (default)
const [currentComponent, setCurrentComponent] = useState(null);
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

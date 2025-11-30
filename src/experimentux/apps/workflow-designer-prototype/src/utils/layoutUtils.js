import * as dagre from 'dagre';

// Node dimensions for layout calculation
const NODE_WIDTH = 200;
const NODE_HEIGHT = 80;

/**
 * Calculate the appropriate dimensions for different node types
 */
const getNodeDimensions = (node) => {
  switch (node.type) {
    case 'start':
    case 'end':
      return { width: 180, height: 60 }; // Oval nodes are slightly narrower
    case 'decision':
      return { width: 160, height: 160 }; // Diamond needs more space
    case 'delay':
      return { width: 200, height: 70 };
    case 'action':
    default:
      return { width: 200, height: 70 };
  }
};

/**
 * Apply hierarchical layout to nodes using dagre
 * @param {Array} nodes - React Flow nodes
 * @param {Array} edges - React Flow edges
 * @param {string} direction - Layout direction ('TB' for top-to-bottom, 'LR' for left-to-right)
 * @returns {Array} Nodes with updated positions
 */
export const getLayoutedNodes = (nodes, edges, direction = 'LR') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Configure the layout
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 80, // Vertical spacing between nodes (tighter)
    ranksep: 100, // Horizontal spacing between ranks (compact)
    edgesep: 40,
    marginx: 50,
    marginy: 50,
  });

  // Add nodes to dagre graph
  nodes.forEach((node) => {
    const dimensions = getNodeDimensions(node);
    dagreGraph.setNode(node.id, dimensions);
  });

  // Add edges to dagre graph
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Calculate layout
  dagre.layout(dagreGraph);

  // Apply calculated positions to nodes
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const dimensions = getNodeDimensions(node);

    return {
      ...node,
      position: {
        x: nodeWithPosition.x - dimensions.width / 2,
        y: nodeWithPosition.y - dimensions.height / 2,
      },
    };
  });

  return layoutedNodes;
};

/**
 * Apply layout with smooth animation
 * This sets up the nodes for React Flow's built-in animation
 */
export const applyLayoutWithAnimation = (nodes, edges, setNodes, direction = 'LR') => {
  const layoutedNodes = getLayoutedNodes(nodes, edges, direction);

  // Update nodes with new positions
  // React Flow will automatically animate the transition
  setNodes(layoutedNodes);

  return layoutedNodes;
};

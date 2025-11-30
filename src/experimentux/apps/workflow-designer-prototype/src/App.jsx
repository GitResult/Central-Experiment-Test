import { useState, useCallback, useRef, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Custom node components
import StartNode from './components/nodes/StartNode';
import ActionNode from './components/nodes/ActionNode';
import DecisionNode from './components/nodes/DecisionNode';
import DelayNode from './components/nodes/DelayNode';
import EndNode from './components/nodes/EndNode';

// Panel components
import Header from './components/panels/Header';
import NodePalettePanel from './components/panels/NodePalettePanel';
import PropertiesPanel from './components/panels/PropertiesPanel';
import FloatingControls from './components/panels/FloatingControls';

// Custom edge components
import AddableEdge from './components/edges/AddableEdge';

// Layout utilities
import { applyLayoutWithAnimation } from './utils/layoutUtils';

// Custom node types mapping
const nodeTypes = {
  start: StartNode,
  action: ActionNode,
  decision: DecisionNode,
  delay: DelayNode,
  end: EndNode,
};

// Custom edge types mapping
const edgeTypes = {
  addable: AddableEdge,
};

// Initial nodes for the example workflow
const initialNodes = [
  {
    id: '1',
    type: 'start',
    position: { x: 100, y: 200 },
    data: { label: 'Start' },
  },
  {
    id: '2',
    type: 'action',
    position: { x: 350, y: 200 },
    data: { label: 'Send Email' },
  },
  {
    id: '3',
    type: 'decision',
    position: { x: 650, y: 200 },
    data: { label: 'Approved?' },
  },
  {
    id: '4',
    type: 'action',
    position: { x: 950, y: 100 },
    data: { label: 'Create Record' },
  },
  {
    id: '5',
    type: 'action',
    position: { x: 950, y: 300 },
    data: { label: 'Send Rejection' },
  },
  {
    id: '6',
    type: 'end',
    position: { x: 1250, y: 200 },
    data: { label: 'End' },
  },
];

// Initial edges (connections) - will be updated with onAddNode handler in component
const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'addable',
    style: { stroke: '#d1d5db', strokeWidth: 2 },
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    type: 'addable',
    style: { stroke: '#d1d5db', strokeWidth: 2 },
  },
  {
    id: 'e3-4',
    source: '3',
    sourceHandle: 'yes',
    target: '4',
    type: 'addable',
    style: { stroke: '#10b981', strokeWidth: 2 },
    label: 'Yes',
  },
  {
    id: 'e3-5',
    source: '3',
    sourceHandle: 'no',
    target: '5',
    type: 'addable',
    style: { stroke: '#ef4444', strokeWidth: 2 },
    label: 'No',
  },
  {
    id: 'e4-6',
    source: '4',
    target: '6',
    type: 'addable',
    style: { stroke: '#d1d5db', strokeWidth: 2 },
  },
  {
    id: 'e5-6',
    source: '5',
    target: '6',
    type: 'addable',
    style: { stroke: '#d1d5db', strokeWidth: 2 },
  },
];

function WorkflowDesigner() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [showPalette, setShowPalette] = useState(true);
  const [showInspector, setShowInspector] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [workflowName, setWorkflowName] = useState('Approval Workflow');
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [lastAddedNodeId, setLastAddedNodeId] = useState(null);
  const [insertModeEdgeId, setInsertModeEdgeId] = useState(null);

  // Enter insert mode - open palette and set the target edge
  const onEnterInsertMode = useCallback((edgeId) => {
    setInsertModeEdgeId(edgeId);
    setShowPalette(true); // Always open palette when entering insert mode
  }, []);

  // Exit insert mode
  const onExitInsertMode = useCallback(() => {
    setInsertModeEdgeId(null);
    setLastAddedNodeId(null);
  }, []);

  // Handle adding a node in the middle of an edge
  const onAddNode = useCallback(
    (nodeType) => {
      const edgeId = insertModeEdgeId;
      if (!edgeId) return;
      const edge = edges.find((e) => e.id === edgeId);
      if (!edge) return;

      const sourceNode = nodes.find((n) => n.id === edge.source);
      const targetNode = nodes.find((n) => n.id === edge.target);
      if (!sourceNode || !targetNode) return;

      // If adding to the last added node, use it as source
      const actualSource = lastAddedNodeId ? nodes.find((n) => n.id === lastAddedNodeId) || sourceNode : sourceNode;

      // Calculate position - midpoint between source and target
      const position = {
        x: (actualSource.position.x + targetNode.position.x) / 2,
        y: (actualSource.position.y + targetNode.position.y) / 2,
      };

      // Create new node
      const newNodeId = `node-${Date.now()}`;
      const newNode = {
        id: newNodeId,
        type: nodeType,
        position,
        data: { label: nodeType.charAt(0).toUpperCase() + nodeType.slice(1) },
      };

      // Create new edge IDs
      const newEdge1Id = `e-${actualSource.id}-${newNodeId}`;
      const newEdge2Id = `e-${newNodeId}-${edge.target}`;

      // Create new edges
      const filteredEdges = edges.filter((e) => e.id !== edgeId);
      const newEdge1 = {
        id: newEdge1Id,
        source: actualSource.id,
        target: newNodeId,
        type: 'addable',
        sourceHandle: edge.sourceHandle,
        style: edge.style || { stroke: '#d1d5db', strokeWidth: 2 },
        data: { onEnterInsertMode },
      };
      const newEdge2 = {
        id: newEdge2Id,
        source: newNodeId,
        target: edge.target,
        type: 'addable',
        targetHandle: edge.targetHandle,
        style: edge.style || { stroke: '#d1d5db', strokeWidth: 2 },
        data: { onEnterInsertMode },
      };
      const updatedEdges = [...filteredEdges, newEdge1, newEdge2];

      // Add new node to nodes array
      const updatedNodes = [...nodes, newNode];

      // Apply layout to get new positions
      const layoutedNodes = applyLayoutWithAnimation(updatedNodes, updatedEdges, setNodes);

      // Update edges state
      setEdges(updatedEdges);

      // Track last added node for sequential adding
      setLastAddedNodeId(newNodeId);

      // Update insert mode to target the new edge (for sequential adding)
      setInsertModeEdgeId(newEdge2Id);

      // Auto-select the new node (find it in layouted nodes to get correct position)
      const layoutedNewNode = layoutedNodes.find(n => n.id === newNodeId) || newNode;
      setSelectedNode(layoutedNewNode);
      setShowInspector(true);

      // Keep palette open for sequential adding
    },
    [edges, nodes, lastAddedNodeId, insertModeEdgeId, onEnterInsertMode, setEdges, setNodes]
  );

  // Update edges with onEnterInsertMode handler
  useEffect(() => {
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        data: { ...edge.data, onEnterInsertMode },
      }))
    );
  }, [onEnterInsertMode, setEdges]);

  // Handle node connections
  const onConnect = useCallback(
    (params) => {
      const newEdge = {
        ...params,
        type: 'addable',
        style: { stroke: '#d1d5db', strokeWidth: 2 },
        data: { onEnterInsertMode },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges, onEnterInsertMode]
  );

  // Handle node clicks
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    setShowInspector(true);
  }, []);

  // Handle canvas click (deselect)
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Handle drag and drop from palette
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const label = event.dataTransfer.getData('nodeLabel');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `${Date.now()}`,
        type,
        position,
        data: { label: label || type },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  // Update node data
  const onUpdateNode = useCallback(
    (nodeId, newData) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                ...newData,
              },
            };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Cmd/Ctrl + 1 - Toggle palette
      if ((e.metaKey || e.ctrlKey) && e.key === '1') {
        e.preventDefault();
        setShowPalette((prev) => !prev);
      }

      // Cmd/Ctrl + 2 - Toggle inspector
      if ((e.metaKey || e.ctrlKey) && e.key === '2') {
        e.preventDefault();
        setShowInspector((prev) => !prev);
      }

      // Cmd/Ctrl + 0 - Focus mode (hide all panels)
      if ((e.metaKey || e.ctrlKey) && e.key === '0') {
        e.preventDefault();
        setShowPalette(false);
        setShowInspector(false);
      }

      // Escape - Close inspector
      if (e.key === 'Escape') {
        setSelectedNode(null);
        setShowInspector(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-neutral-100">
      {/* FULL-PAGE CANVAS */}
      <div ref={reactFlowWrapper} className="absolute inset-0">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          attributionPosition="bottom-left"
          nodesDraggable={true}
          nodesConnectable={true}
          elementsSelectable={true}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        >
          {/* Subtle dot grid */}
          <Background variant="dots" gap={24} size={1} color="#e5e7eb" />

          {/* MiniMap with Apple styling */}
          <MiniMap
            pannable
            zoomable
            nodeColor={(node) => {
              const colors = {
                start: '#10b981',
                action: '#3b82f6',
                decision: '#f59e0b',
                delay: '#a855f7',
                end: '#ef4444',
              };
              return colors[node.type] || '#94a3b8';
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: '12px',
            }}
            className="backdrop-blur-xl"
          />
        </ReactFlow>
      </div>

      {/* HEADER - Floating toolbar */}
      <Header
        showPalette={showPalette}
        showInspector={showInspector}
        onTogglePalette={() => setShowPalette(!showPalette)}
        onToggleInspector={() => setShowInspector(!showInspector)}
        workflowName={workflowName}
        onWorkflowNameChange={setWorkflowName}
      />

      {/* LEFT PANEL - Node Palette */}
      <NodePalettePanel
        isOpen={showPalette}
        onClose={() => setShowPalette(false)}
        insertMode={!!insertModeEdgeId}
        onAddNode={onAddNode}
        onExitInsertMode={onExitInsertMode}
      />

      {/* RIGHT PANEL - Properties Inspector */}
      <PropertiesPanel
        isOpen={showInspector}
        selectedNode={selectedNode}
        onClose={() => setShowInspector(false)}
        onUpdateNode={onUpdateNode}
      />

      {/* FLOATING CONTROLS - Bottom center */}
      <FloatingControls />
    </div>
  );
}

function App() {
  return (
    <ReactFlowProvider>
      <WorkflowDesigner />
    </ReactFlowProvider>
  );
}

export default App;

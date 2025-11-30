/**
 * Panel Manager
 * Global panel management component
 * Provides context and renders taskbar
 */

import PropTypes from 'prop-types';
import Taskbar from './Taskbar';

export function PanelManager({ children }) {
  return (
    <>
      {children}
      <Taskbar />
    </>
  );
}

PanelManager.propTypes = {
  children: PropTypes.node
};

export default PanelManager;

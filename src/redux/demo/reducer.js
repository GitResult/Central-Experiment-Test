// Demo reducer for PersonEssential component
const initialState = {
  selectedTask: null,
  showTaskDetailPanel: false,
  isTaskPanelCollapsed: false,
  isTaskDetailPanelCollapsed: false,
};

const demoReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_DEMO_STATE':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default demoReducer;

import { useState } from 'react';
import { Card, CardHeader, CardBody, Button, Input, DateRangeField } from '@central-ux/ui-components';

function App() {
  const [formFields, setFormFields] = useState([
    { id: 1, type: 'text', label: 'Full Name', required: true },
    { id: 2, type: 'email', label: 'Email Address', required: true },
    { id: 3, type: 'select', label: 'Department', required: false },
  ]);

  const fieldTypes = [
    { type: 'text', label: 'Text Input', icon: '📝' },
    { type: 'email', label: 'Email', icon: '📧' },
    { type: 'number', label: 'Number', icon: '🔢' },
    { type: 'select', label: 'Dropdown', icon: '▼' },
    { type: 'textarea', label: 'Text Area', icon: '📄' },
    { type: 'checkbox', label: 'Checkbox', icon: '☑️' },
    { type: 'radio', label: 'Radio Button', icon: '⭕' },
    { type: 'date', label: 'Date Picker', icon: '📅' },
    { type: 'daterange', label: 'Date Range', icon: '📆' },
  ];

  const addField = (type) => {
    const newField = {
      id: Date.now(),
      type,
      label: `New ${type} field`,
      required: false,
    };
    setFormFields([...formFields, newField]);
  };

  const removeField = (id) => {
    setFormFields(formFields.filter(field => field.id !== id));
  };

  const renderFieldPreview = (field) => {
    switch (field.type) {
      case 'textarea':
        return <textarea className="w-full px-3 py-2 border border-neutral-300 rounded-md" rows="3" />;
      case 'select':
        return (
          <select className="w-full px-3 py-2 border border-neutral-300 rounded-md">
            <option>Select an option</option>
          </select>
        );
      case 'checkbox':
        return <input type="checkbox" className="w-4 h-4" />;
      case 'radio':
        return <input type="radio" className="w-4 h-4" />;
      case 'daterange':
        return <DateRangeField placeholder="Select date range" onChange={(range) => console.log('Date range selected:', range)} />;
      default:
        return <input type={field.type} className="w-full px-3 py-2 border border-neutral-300 rounded-md" />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Form Designer Prototype</h1>
              <p className="text-sm text-neutral-600 mt-1">
                Drag and drop form builder interface
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Preview</Button>
              <Button variant="primary">Save Form</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Field Palette */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-neutral-900">Field Types</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-2">
                  {fieldTypes.map((fieldType) => (
                    <button
                      key={fieldType.type}
                      onClick={() => addField(fieldType.type)}
                      className="w-full text-left px-3 py-2 border border-neutral-200 rounded-md hover:border-primary-400 hover:bg-primary-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{fieldType.icon}</span>
                        <span className="text-sm font-medium text-neutral-900">{fieldType.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardBody>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <h2 className="text-lg font-semibold text-neutral-900">Form Settings</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <Input label="Form Name" placeholder="Contact Form" />
                  <Input label="Form Description" placeholder="Describe your form" />
                  <div>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-sm text-neutral-700">Enable CAPTCHA</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-sm text-neutral-700">Send email notifications</span>
                    </label>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Form Canvas */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-neutral-900">Form Canvas</h2>
              </CardHeader>
              <CardBody>
                {formFields.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-neutral-300 rounded-lg">
                    <p className="text-neutral-500">Click on field types to add them to your form</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formFields.map((field, index) => (
                      <div key={field.id} className="p-4 border border-neutral-200 rounded-lg hover:border-primary-400 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={field.label}
                                onChange={(e) => {
                                  const updated = [...formFields];
                                  updated[index].label = e.target.value;
                                  setFormFields(updated);
                                }}
                                className="font-medium text-neutral-900 border-0 border-b border-transparent hover:border-neutral-300 focus:border-primary-500 outline-none px-1"
                              />
                              {field.required && (
                                <span className="text-red-500 text-sm">*</span>
                              )}
                            </div>
                            <p className="text-xs text-neutral-500 mt-1">Type: {field.type}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const updated = [...formFields];
                                updated[index].required = !updated[index].required;
                                setFormFields(updated);
                              }}
                              className="text-xs px-2 py-1 rounded border border-neutral-300 hover:bg-neutral-50"
                            >
                              {field.required ? 'Required' : 'Optional'}
                            </button>
                            <button
                              onClick={() => removeField(field.id)}
                              className="text-xs px-2 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        <div>
                          {renderFieldPreview(field)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-neutral-200">
                  <Button variant="primary" className="w-full">Submit Form</Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

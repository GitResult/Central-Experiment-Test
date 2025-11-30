function App() {
  const prototypes = [
    {
      name: 'Dashboard',
      description: 'Communications dashboard with funnel visualizations and campaign metrics',
      port: 3001,
    },
    {
      name: 'Reports',
      description: 'Advanced analytics and data visualization',
      port: 3002,
    },
    {
      name: 'Records',
      description: 'Members management with drag-and-drop form builder and committee tracking',
      port: 3003,
    },
    {
      name: 'Form Designer',
      description: 'Interactive form builder with custom date range selector',
      port: 3004,
    },
    {
      name: 'Workflow Designer',
      description: 'Visual flowchart designer with auto-layout and React Flow',
      port: 3005,
    },
  ];

  const openPrototype = (port) => {
    window.open(`http://localhost:${port}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-neutral-200/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="text-xl font-semibold tracking-tight text-neutral-900">
              Central
            </div>
            <div className="flex items-center gap-8">
              <a href="#prototypes" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                Prototypes
              </a>
              <a href="#docs" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                Documentation
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-6xl lg:text-7xl font-bold tracking-tight text-neutral-900 mb-6">
            Enterprise grade.
            <br />
            <span className="bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 bg-clip-text text-transparent">
              Prototype speed.
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-neutral-600 max-w-3xl mx-auto font-light leading-relaxed mb-12">
            A revolutionary prototyping workspace designed for enterprise applications.
            Build, iterate, and perfect your vision with unprecedented speed and precision.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => document.getElementById('prototypes').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 bg-neutral-900 text-white rounded-full font-medium hover:bg-neutral-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Explore Prototypes
            </button>
            <a
              href="#docs"
              className="px-8 py-3 text-neutral-900 hover:text-neutral-600 transition-colors font-medium"
            >
              Learn more →
            </a>
          </div>
        </div>
      </section>

      {/* Prototypes Section */}
      <section id="prototypes" className="py-20 px-6 lg:px-8 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 mb-4">
              Five powerful modules.
            </h2>
            <p className="text-xl text-neutral-600 font-light">
              Each crafted for excellence. All working in harmony.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {prototypes.map((prototype, index) => (
              <button
                key={prototype.name}
                onClick={() => openPrototype(prototype.port)}
                className={`group relative overflow-hidden bg-white rounded-3xl p-8 lg:p-12 text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border border-neutral-200/50 hover:border-neutral-300 hover:shadow-2xl ${
                  index === prototypes.length - 1 && prototypes.length % 2 !== 0 ? 'lg:col-span-2' : ''
                }`}
              >
                <div className="relative z-10">
                  <div className="text-sm font-medium text-neutral-500 mb-3 tracking-wide uppercase">
                    Module {index + 1}
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-3 tracking-tight">
                    {prototype.name}
                  </h3>
                  <p className="text-lg text-neutral-600 mb-6 font-light">
                    {prototype.description}
                  </p>
                  <div className="flex items-center gap-2 text-neutral-900 font-medium">
                    <span>Launch prototype</span>
                    <svg
                      className="w-5 h-5 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold tracking-tight text-neutral-900 mb-4">
              Built for efficiency.
            </h2>
            <p className="text-xl text-neutral-600 font-light">
              Every detail refined for the modern enterprise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="w-12 h-12 mx-auto mb-6 bg-neutral-900 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">Lightning Fast</h3>
              <p className="text-neutral-600 font-light leading-relaxed">
                Built on Vite with instant hot module replacement for rapid development cycles.
              </p>
            </div>

            <div className="text-center p-8">
              <div className="w-12 h-12 mx-auto mb-6 bg-neutral-900 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">Modular Design</h3>
              <p className="text-neutral-600 font-light leading-relaxed">
                Independent prototypes that seamlessly integrate when you're ready.
              </p>
            </div>

            <div className="text-center p-8">
              <div className="w-12 h-12 mx-auto mb-6 bg-neutral-900 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">Design System</h3>
              <p className="text-neutral-600 font-light leading-relaxed">
                Unified components and tokens for consistent, beautiful interfaces.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Documentation Preview */}
      <section id="docs" className="py-20 px-6 lg:px-8 bg-neutral-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold tracking-tight mb-6">
            Get started in minutes.
          </h2>
          <p className="text-xl text-neutral-400 font-light mb-12">
            Comprehensive documentation guides you every step of the way.
          </p>

          <div className="bg-neutral-800/50 backdrop-blur-xl rounded-2xl p-8 text-left border border-neutral-700">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <pre className="text-sm text-neutral-300 font-mono leading-relaxed">
              <code>{`# Install dependencies
npm install

# Start prototyping
npm run dev

# Launch specific module
npm run dev:dashboard`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-8 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-neutral-600">
              © 2024 Central UX Experiments. Enterprise Application Prototyping.
            </div>
            <div className="flex items-center gap-8 text-sm text-neutral-600">
              <a href="#" className="hover:text-neutral-900 transition-colors">Documentation</a>
              <a href="#" className="hover:text-neutral-900 transition-colors">Architecture</a>
              <a href="#" className="hover:text-neutral-900 transition-colors">Components</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

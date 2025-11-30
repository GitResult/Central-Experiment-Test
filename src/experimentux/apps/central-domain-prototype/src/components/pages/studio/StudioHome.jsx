/**
 * StudioHome Page
 * Landing page for Studio features
 */

import { useNavigate } from 'react-router-dom';
import { Zap, Network, Presentation } from 'lucide-react';
import { theme } from '../../../config/theme';

export function StudioHome() {
  const navigate = useNavigate();

  const studioFeatures = [
    {
      icon: Zap,
      title: 'Blueprint Generator',
      description: 'Auto-generate CRUD pages from CSV files with 5-step wizard',
      path: '/studio/blueprint',
      color: theme.colors.primary[500],
      features: ['CSV → Pages', '5-step wizard', 'Help5 integration', 'Auto-generates code']
    },
    {
      icon: Network,
      title: 'DEPTH View',
      description: 'Enterprise strategy canvas with 5 containers',
      path: '/studio/depth',
      color: theme.colors.success[500],
      features: ['5 containers', 'Lens modes', 'Help5 coverage', 'Governance dashboard']
    },
    {
      icon: Presentation,
      title: 'Presenter Mode',
      description: 'Create presentations from markdown with dual-screen view',
      path: '/studio/presenter',
      color: theme.colors.warning[500],
      features: ['Markdown → Slides', '8 layouts', 'Speaker notes', 'Export to HTML/PDF']
    }
  ];

  return (
    <div style={{
      padding: theme.spacing[8],
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{ marginBottom: theme.spacing[8] }}>
        <h1 style={{
          fontSize: theme.typography.fontSize['4xl'],
          fontWeight: theme.typography.fontWeight.bold,
          color: theme.colors.text.primary,
          marginBottom: theme.spacing[3]
        }}>
          Studio
        </h1>
        <p style={{
          fontSize: theme.typography.fontSize.lg,
          color: theme.colors.text.secondary,
          margin: 0
        }}>
          Enterprise tools for rapid development, strategy, and presentations
        </p>
      </div>

      {/* Feature Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: theme.spacing[6]
      }}>
        {studioFeatures.map((feature, index) => (
          <button
            key={index}
            onClick={() => navigate(feature.path)}
            style={{
              padding: theme.spacing[6],
              backgroundColor: theme.colors.background.elevated,
              border: `1px solid ${theme.colors.border.default}`,
              borderRadius: theme.borderRadius.lg,
              textAlign: 'left',
              cursor: 'pointer',
              transition: `all ${theme.transitions.normal}`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = theme.shadows.lg;
              e.currentTarget.style.borderColor = feature.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = theme.colors.border.default;
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: theme.borderRadius.lg,
              backgroundColor: `${feature.color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: theme.spacing[4]
            }}>
              <feature.icon size={24} color={feature.color} />
            </div>

            <h3 style={{
              fontSize: theme.typography.fontSize.xl,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing[2]
            }}>
              {feature.title}
            </h3>

            <p style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary,
              marginBottom: theme.spacing[4],
              lineHeight: '1.6'
            }}>
              {feature.description}
            </p>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: theme.spacing[2]
            }}>
              {feature.features.map((feat, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                    fontSize: theme.typography.fontSize.xs,
                    backgroundColor: theme.colors.background.secondary,
                    color: theme.colors.text.tertiary,
                    borderRadius: theme.borderRadius.md
                  }}
                >
                  {feat}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* Coming Soon Section */}
      <div style={{
        marginTop: theme.spacing[12],
        padding: theme.spacing[6],
        backgroundColor: theme.colors.primary[50],
        borderRadius: theme.borderRadius.lg,
        border: `1px solid ${theme.colors.primary[200]}`
      }}>
        <h2 style={{
          fontSize: theme.typography.fontSize.xl,
          fontWeight: theme.typography.fontWeight.semibold,
          color: theme.colors.primary[700],
          marginBottom: theme.spacing[3]
        }}>
          More Studio Features Coming Soon
        </h2>
        <p style={{
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.primary[600],
          margin: 0,
          lineHeight: '1.6'
        }}>
          We're continuously adding new enterprise tools to help you build faster and smarter.
          Stay tuned for workflow automation, advanced analytics, and team collaboration features.
        </p>
      </div>
    </div>
  );
}

export default StudioHome;

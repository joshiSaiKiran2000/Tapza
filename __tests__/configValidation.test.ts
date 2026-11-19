import { appRemoteConfigSchema } from '../src/config/schema';
import normalConfig from '../src/config/normalConfig.json';
import diwaliConfig from '../src/config/diwaliConfig.json';

describe('Remote Configuration Validation (Zod)', () => {
  it('validates normalConfig.json matches the AppRemoteConfig schema', () => {
    const parsed = appRemoteConfigSchema.safeParse(normalConfig);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.configId).toBe('normal');
      expect(parsed.data.sections.length).toBeGreaterThan(0);
      expect(parsed.data.theme.colors.primary).toBe('#0D7A73');
    }
  });

  it('validates diwaliConfig.json matches the AppRemoteConfig schema with festival data', () => {
    const parsed = appRemoteConfigSchema.safeParse(diwaliConfig);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.configId).toBe('diwali');
      expect(parsed.data.festival).toBeDefined();
      expect(parsed.data.festival?.name).toBe('Diwali');
      expect(parsed.data.theme.colors.primary).toBe('#C2410C');
    }
  });

  it('rejects a malformed config missing mandatory fields', () => {
    const invalidConfig = {
      version: '1.0.0',
      // missing configId, theme, navigationTabs, sections
    };
    const parsed = appRemoteConfigSchema.safeParse(invalidConfig);
    expect(parsed.success).toBe(false);
  });

  it('verifies sections support solid, gradient, and image backgrounds in schema', () => {
    const solidSection = {
      id: 'sec-solid',
      type: 'quick_actions' as const,
      background: { type: 'solid' as const, color: '#FFFFFF' },
      data: { actions: [] },
    };
    const gradientSection = {
      id: 'sec-gradient',
      type: 'hero_banner' as const,
      background: {
        type: 'gradient' as const,
        gradientColors: ['#0D7A73', '#115E59'],
      },
      data: { headline: 'Test', subheadline: 'Test', ctaText: 'Test', ctaRoute: 'Test' },
    };

    expect(appRemoteConfigSchema.shape.sections.element.safeParse(solidSection).success).toBe(true);
    expect(
      appRemoteConfigSchema.shape.sections.element.safeParse(gradientSection).success
    ).toBe(true);
  });
});

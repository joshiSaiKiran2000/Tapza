import { z } from 'zod';

/**
 * Background configuration schema: solid, gradient, or image
 */
export const backgroundConfigSchema = z.object({
  type: z.enum(['solid', 'gradient', 'image']),
  color: z.string().optional(),
  gradientColors: z.array(z.string()).optional(),
  gradientLocations: z.array(z.number()).optional(),
  gradientStart: z.object({ x: z.number(), y: z.number() }).optional(),
  gradientEnd: z.object({ x: z.number(), y: z.number() }).optional(),
  imageUrl: z.string().optional(),
  imageBlurRadius: z.number().optional(),
  imageOpacity: z.number().optional(),
});

export type BackgroundConfig = z.infer<typeof backgroundConfigSchema>;

/**
 * Section: Hero Banner
 */
export const heroBannerDataSchema = z.object({
  badgeText: z.string().optional(),
  headline: z.string(),
  headlineHindi: z.string().optional(),
  subheadline: z.string(),
  ctaText: z.string(),
  ctaRoute: z.string(),
  ctaParams: z.record(z.string(), z.any()).optional(),
  imageUrl: z.string().optional(),
  accentNote: z.string().optional(),
});
export type HeroBannerData = z.infer<typeof heroBannerDataSchema>;

/**
 * Section: Category Chips
 */
export const categoryChipItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  hindiLabel: z.string().optional(),
  icon: z.string(),
  isSpecial: z.boolean().optional(),
  specialityQuery: z.string().optional(),
});
export const categoryChipsDataSchema = z.object({
  categories: z.array(categoryChipItemSchema),
});
export type CategoryChipItem = z.infer<typeof categoryChipItemSchema>;
export type CategoryChipsData = z.infer<typeof categoryChipsDataSchema>;

/**
 * Section: Quick Actions
 */
export const quickActionItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  sublabel: z.string().optional(),
  icon: z.string(),
  route: z.string(),
  badge: z.string().optional(),
  color: z.string().optional(),
});
export const quickActionsDataSchema = z.object({
  actions: z.array(quickActionItemSchema),
});
export type QuickActionItem = z.infer<typeof quickActionItemSchema>;
export type QuickActionsData = z.infer<typeof quickActionsDataSchema>;

/**
 * Section: Service Grid
 */
export const serviceGridItemSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  name: z.string().optional(),
  subtitle: z.string().optional(),
  icon: z.string().optional(),
  image: z.string().optional(),
  imageUrl: z.string().optional(),
  price: z.union([z.number(), z.string()]).optional(),
  priceRupees: z.union([z.number(), z.string()]).optional(),
  originalPrice: z.union([z.number(), z.string()]).optional(),
  badge: z.string().optional(),
  tag: z.string().optional(),
  route: z.string().optional(),
  discount: z.string().optional(),
});
export const serviceGridDataSchema = z.object({
  columns: z.number().default(2),
  services: z.array(serviceGridItemSchema),
});
export type ServiceGridItem = z.infer<typeof serviceGridItemSchema>;
export type ServiceGridData = z.infer<typeof serviceGridDataSchema>;

/**
 * Section: Doctor Carousel
 */
export const doctorCarouselItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  speciality: z.string(),
  experienceYears: z.number(),
  rating: z.number(),
  reviewsCount: z.number(),
  fee: z.number(),
  clinic: z.string(),
  area: z.string(),
  availableToday: z.boolean(),
  nextAvailableSlot: z.string().optional(),
  imageUrl: z.string().optional(),
});
export const doctorCarouselDataSchema = z.object({
  doctors: z.array(doctorCarouselItemSchema),
});
export type DoctorCarouselItem = z.infer<typeof doctorCarouselItemSchema>;
export type DoctorCarouselData = z.infer<typeof doctorCarouselDataSchema>;

/**
 * Section: Offer Strip
 */
export const offerStripDataSchema = z.object({
  id: z.string(),
  title: z.string(),
  titleHindi: z.string().optional(),
  code: z.string(),
  discountText: z.string(),
  description: z.string(),
  validTill: z.string(),
  ctaText: z.string(),
  highlight: z.boolean().optional(),
});
export type OfferStripData = z.infer<typeof offerStripDataSchema>;

/**
 * Generic Home Section
 */
export const homeSectionSchema = z.object({
  id: z.string(),
  type: z.enum([
    'hero_banner',
    'category_chips',
    'quick_actions',
    'service_grid',
    'doctor_carousel',
    'offer_strip',
  ]),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  background: backgroundConfigSchema,
  data: z.any(),
});
export type HomeSection = z.infer<typeof homeSectionSchema>;

/**
 * Navigation Tab item in Remote Config
 */
export const navTabConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  title: z.string(),
  icon: z.string(),
  enabled: z.boolean().default(true),
});
export type NavTabConfig = z.infer<typeof navTabConfigSchema>;

/**
 * Full Remote App Configuration Schema
 */
export const appRemoteConfigSchema = z.object({
  version: z.string(),
  configId: z.enum(['normal', 'diwali']),
  configName: z.string(),
  lastUpdated: z.string(),
  festival: z
    .object({
      name: z.string(),
      greeting: z.string(),
      greetingHindi: z.string(),
      bannerMessage: z.string(),
      badgeText: z.string(),
    })
    .optional(),
  theme: z.object({
    colors: z.record(z.string(), z.string()),
    darkColors: z.record(z.string(), z.string()).optional(),
  }),
  navigationTabs: z.array(navTabConfigSchema),
  sections: z.array(homeSectionSchema),
});

export type AppRemoteConfig = z.infer<typeof appRemoteConfigSchema>;

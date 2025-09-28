// import type { GlobalConfig } from '@payloadcms/payload/types'

export const Navigation: Record<string, unknown> = {
  slug: 'navigation',
  label: 'Navigation',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'mainMenuItems',
      label: 'Main Menu Items',
      type: 'array',
      minRows: 1,
      maxRows: 8,
      fields: [
        {
          name: 'title',
          label: 'Menu Title',
          type: 'text',
          required: true,
        },
        {
          name: 'href',
          label: 'URL/Path',
          type: 'text',
          required: true,
          admin: {
            description: 'Use relative paths like /about or full URLs like https://example.com',
          },
        },
        {
          name: 'description',
          label: 'Description',
          type: 'text',
          admin: {
            description: 'Optional description for dropdown menus',
          },
        },
        {
          name: 'children',
          label: 'Sub-menu Items',
          type: 'array',
          maxRows: 6,
          fields: [
            {
              name: 'title',
              label: 'Sub-item Title',
              type: 'text',
              required: true,
            },
            {
              name: 'href',
              label: 'URL/Path',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              label: 'Description',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      name: 'ctaButton',
      label: 'CTA Button',
      type: 'group',
      fields: [
        {
          name: 'text',
          label: 'Button Text',
          type: 'text',
          required: true,
          defaultValue: 'Get In Touch',
        },
        {
          name: 'href',
          label: 'Button URL',
          type: 'text',
          required: true,
          defaultValue: '/contact',
        },
        {
          name: 'variant',
          label: 'Button Style',
          type: 'select',
          defaultValue: 'outline',
          options: [
            { label: 'Outline', value: 'outline' },
            { label: 'Filled', value: 'default' },
            { label: 'Ghost', value: 'ghost' },
          ],
        },
      ],
    },
    {
      name: 'settings',
      label: 'Navigation Settings',
      type: 'group',
      fields: [
        {
          name: 'showLogo',
          label: 'Show Logo',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'enableStickyNavigation',
          label: 'Enable Sticky Navigation',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'useMegaMenu',
          label: 'Use Mega Menu',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Enable mega menu navigation instead of standard dropdown navigation',
          },
        },
      ],
    },
    {
      name: 'megaMenuData',
      label: 'Mega Menu Configuration',
      type: 'group',
      admin: {
        description: 'Configure the mega menu sections and content. Only used when "Use Mega Menu" is enabled.',
      },
      fields: [
        {
          name: 'sections',
          label: 'Mega Menu Sections',
          type: 'array',
          minRows: 3,
          maxRows: 6,
          admin: {
            description: 'Configure the sections that will appear in the mega menu',
          },
          fields: [
            {
              name: 'title',
              label: 'Section Title',
              type: 'text',
              required: true,
              admin: {
                description: 'The main title for this section (e.g., "Growth Marketing")',
              },
            },
            {
              name: 'href',
              label: 'Section URL',
              type: 'text',
              required: true,
              admin: {
                description: 'The URL for the section title link (e.g., "/growth-marketing")',
              },
            },
            {
              name: 'links',
              label: 'Section Links',
              type: 'array',
              minRows: 1,
              maxRows: 8,
              admin: {
                description: 'The navigation links within this section',
              },
              fields: [
                {
                  name: 'title',
                  label: 'Link Title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'href',
                  label: 'Link URL',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'isActive',
                  label: 'Mark as Active',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Mark this link as currently active/selected',
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'ctaSection',
          label: 'CTA Section',
          type: 'group',
          admin: {
            description: 'Configure the call-to-action section in the mega menu',
          },
          fields: [
            {
              name: 'primaryButton',
              label: 'Primary Button',
              type: 'group',
              fields: [
                {
                  name: 'text',
                  label: 'Button Text',
                  type: 'text',
                  required: true,
                  defaultValue: 'Get in touch',
                },
                {
                  name: 'href',
                  label: 'Button URL',
                  type: 'text',
                  required: true,
                  defaultValue: '/contact',
                },
              ],
            },
            {
              name: 'phoneNumber',
              label: 'Phone Number',
              type: 'group',
              fields: [
                {
                  name: 'display',
                  label: 'Display Text',
                  type: 'text',
                  required: true,
                  defaultValue: '+44 (0) 1244 567560',
                },
                {
                  name: 'href',
                  label: 'Phone URL',
                  type: 'text',
                  required: true,
                  defaultValue: 'tel:+441244567560',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
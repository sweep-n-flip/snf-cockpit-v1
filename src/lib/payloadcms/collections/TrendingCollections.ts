import type { CollectionConfig } from 'payload'

export const TrendingCollections: CollectionConfig = {
  slug: 'trending-collections',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'address', 'nativeChain', 'rank1Day', 'volume'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'collectionId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'address',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'symbol',
      type: 'text',
    },
    {
      name: 'image',
      type: 'text',
    },
    {
      name: 'banner',
      type: 'text',
    },
    {
      name: 'nativeChain',
      type: 'number', // Chain ID directly
      required: true,
      index: true,
    },
    {
      name: 'verified',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'contractKind',
      type: 'select',
      options: [
        { label: 'ERC-721', value: 'erc721' },
        { label: 'ERC-1155', value: 'erc1155' },
      ],
      defaultValue: 'erc721',
    },
    {
      name: 'totalSupply',
      type: 'number',
    },
    {
      name: 'onSaleCount',
      type: 'number',
    },
    {
      name: 'ownerCount',
      type: 'number',
    },
    {
      name: 'floorAskPrice',
      type: 'number',
    },
    {
      name: 'floorAskPriceUsd',
      type: 'number',
    },
    {
      name: 'floorChange',
      type: 'group',
      fields: [
        {
          name: 'percentage1Day',
          type: 'number',
        },
        {
          name: 'percentage7Day',
          type: 'number',
        },
        {
          name: 'percentage30Day',
          type: 'number',
        },
      ],
    },
    {
      name: 'volume',
      type: 'group',
      fields: [
        {
          name: 'volume1Day',
          type: 'number',
        },
        {
          name: 'volume7Day',
          type: 'number',
        },
        {
          name: 'volume30Day',
          type: 'number',
        },
        {
          name: 'volumeChange1Day',
          type: 'number',
        },
        {
          name: 'volumeChange7Day',
          type: 'number',
        },
        {
          name: 'volumeChange30Day',
          type: 'number',
        },
      ],
    },
    {
      name: 'sales',
      type: 'group',
      fields: [
        {
          name: 'sales1Day',
          type: 'number',
        },
        {
          name: 'sales7Day',
          type: 'number',
        },
        {
          name: 'sales30Day',
          type: 'number',
        },
      ],
    },
    {
      name: 'marketCap',
      type: 'number',
    },
    {
      name: 'royaltiesBps',
      type: 'number',
    },
    {
      name: 'royaltiesRecipient',
      type: 'text',
    },
    {
      name: 'isSpam',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'openseaVerificationStatus',
      type: 'select',
      options: [
        { label: 'Verified', value: 'verified' },
        { label: 'Requested', value: 'requested' },
        { label: 'Not Requested', value: 'not_requested' },
        { label: 'Approved', value: 'approved' },
        { label: 'Unknown', value: 'unknown' },
      ],
      defaultValue: 'unknown',
    },
    {
      name: 'magicedenVerificationStatus',
      type: 'text',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'externalUrl',
      type: 'text',
    },
    {
      name: 'twitterUsername',
      type: 'text',
    },
    {
      name: 'discordUrl',
      type: 'text',
    },
    {
      name: 'telegramUrl',
      type: 'text',
    },
    {
      name: 'instagramUsername',
      type: 'text',
    },
    {
      name: 'mediumUsername',
      type: 'text',
    },
    {
      name: 'facebookUsername',
      type: 'text',
    },
    {
      name: 'allTimeVolume',
      type: 'group',
      fields: [
        {
          name: 'volume',
          type: 'number',
        },
        {
          name: 'volumeUsd',
          type: 'number',
        },
      ],
    },
    {
      name: 'lastSyncAt',
      type: 'date',
      defaultValue: () => new Date(),
    },
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'rank1Day',
      type: 'number',
    },
    {
      name: 'rank7Day',
      type: 'number',
    },
    {
      name: 'rank30Day',
      type: 'number',
    },
    {
      name: 'trendingScore1Day',
      type: 'number',
    },
    {
      name: 'trendingScore7Day',
      type: 'number',
    },
    {
      name: 'trendingScore30Day',
      type: 'number',
    },
  ],
  timestamps: true,
}

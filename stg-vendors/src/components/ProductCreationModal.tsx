'use client'

import { useState } from 'react'
import { Button, Text, Heading, Input, Textarea, Select, Badge } from '@medusajs/ui'
import { X, Plus, Minus } from '@medusajs/icons'
import { postToBackend } from '@/utils/fetch'

interface ProductCreationModalProps {
  isOpen: boolean
  onClose: () => void
  onProductCreated: () => void
}

interface ProductVariant {
  title: string
  sku: string
  prices: Array<{
    amount: number
    currency_code: string
  }>
  options?: Record<string, string>
}

interface ProductOption {
  title: string
  values: string[]
}

interface ProductImage {
  url: string
}

export default function ProductCreationModal({ isOpen, onClose, onProductCreated }: ProductCreationModalProps) {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'basic' | 'variants' | 'options' | 'images' | 'advanced'>('basic')

  // Basic product info
  const [title, setTitle] = useState('')
  const [handle, setHandle] = useState('')
  const [description, setDescription] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [status, setStatus] = useState('draft')
  const [isGiftcard, setIsGiftcard] = useState(false)
  const [thumbnail, setThumbnail] = useState('')

  // Physical properties
  const [weight, setWeight] = useState('')
  const [width, setWidth] = useState('')
  const [length, setLength] = useState('')
  const [height, setHeight] = useState('')
  const [originCountry, setOriginCountry] = useState('')
  const [hsCode, setHsCode] = useState('')
  const [midCode, setMidCode] = useState('')
  const [material, setMaterial] = useState('')

  // Categorization
  const [collectionId, setCollectionId] = useState('')
  const [typeId, setTypeId] = useState('')
  const [tagIds, setTagIds] = useState<string[]>([])
  const [categoryIds, setCategoryIds] = useState<string[]>([])

  // Settings
  const [discountable, setDiscountable] = useState(true)
  const [metadata, setMetadata] = useState<Record<string, string>>({})

  // Product structure
  const [variants, setVariants] = useState<ProductVariant[]>([
    {
      title: 'Default Variant',
      sku: `SKU-${Date.now()}`,
      prices: [
        {
          amount: 1000,
          currency_code: 'usd'
        }
      ]
    }
  ])

  const [options, setOptions] = useState<ProductOption[]>([
    {
      title: 'Size',
      values: ['S', 'M', 'L', 'XL']
    }
  ])

  const [images, setImages] = useState<ProductImage[]>([])

  // External integration
  const [externalId, setExternalId] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const productData = {
        title,
        handle: handle || `product-${Date.now()}`,
        description,
        subtitle,
        status,
        is_giftcard: isGiftcard,
        thumbnail,
        weight: weight ? parseInt(weight) : undefined,
        width: width ? parseInt(width) : undefined,
        length: length ? parseInt(length) : undefined,
        height: height ? parseInt(height) : undefined,
        origin_country: originCountry,
        hs_code: hsCode,
        mid_code: midCode,
        material,
        collection_id: collectionId || undefined,
        type_id: typeId || undefined,
        tag_ids: tagIds,
        category_ids: categoryIds,
        discountable,
        metadata,
        variants: variants.length > 0 ? variants : undefined,
        options: options.length > 0 ? options : undefined,
        images,
        external_id: externalId || undefined,
      }

      await postToBackend('/vendors/products', productData, { withCredentials: true })

      onProductCreated()
      onClose()
      resetForm()
    } catch (error) {
      console.error('Failed to create product:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setTitle('')
    setHandle('')
    setDescription('')
    setSubtitle('')
    setStatus('draft')
    setIsGiftcard(false)
    setThumbnail('')
    setWeight('')
    setWidth('')
    setLength('')
    setHeight('')
    setOriginCountry('')
    setHsCode('')
    setMidCode('')
    setMaterial('')
    setCollectionId('')
    setTypeId('')
    setTagIds([])
    setCategoryIds([])
    setDiscountable(true)
    setMetadata({})
    setVariants([{
      title: 'Default Variant',
      sku: `SKU-${Date.now()}`,
      prices: [{ amount: 1000, currency_code: 'usd' }]
    }])
    setOptions([{ title: 'Size', values: ['S', 'M', 'L', 'XL'] }])
    setImages([])
    setExternalId('')
  }

  const addVariant = () => {
    setVariants([...variants, {
      title: `Variant ${variants.length + 1}`,
      sku: `SKU-${Date.now()}-${variants.length + 1}`,
      prices: [{ amount: 1000, currency_code: 'usd' }]
    }])
  }

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    const newVariants = [...variants]
    newVariants[index] = { ...newVariants[index], [field]: value }
    setVariants(newVariants)
  }

  const addOption = () => {
    setOptions([...options, { title: '', values: [] }])
  }

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index))
  }

  const updateOption = (index: number, field: keyof ProductOption, value: any) => {
    const newOptions = [...options]
    newOptions[index] = { ...newOptions[index], [field]: value }
    setOptions(newOptions)
  }

  const addImage = () => {
    setImages([...images, { url: '' }])
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const updateImage = (index: number, url: string) => {
    const newImages = [...images]
    newImages[index] = { url }
    setImages(newImages)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <Heading level="h2">Create New Product</Heading>
            <Button variant="transparent" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 border-b">
            {[
              { id: 'basic', label: 'Basic Info' },
              { id: 'variants', label: 'Variants' },
              { id: 'options', label: 'Options' },
              { id: 'images', label: 'Images' },
              { id: 'advanced', label: 'Advanced' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg ${activeTab === tab.id
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text className="text-sm font-medium mb-2">Title *</Text>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Product title"
                    required
                  />
                </div>
                <div>
                  <Text className="text-sm font-medium mb-2">Handle</Text>
                  <Input
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="product-handle"
                  />
                </div>
              </div>

              <div>
                <Text className="text-sm font-medium mb-2">Description</Text>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Product description"
                  rows={3}
                />
              </div>

              <div>
                <Text className="text-sm font-medium mb-2">Subtitle</Text>
                <Input
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Product subtitle"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text className="text-sm font-medium mb-2">Status</Text>
                  <Select value={status} onValueChange={setStatus}>
                    <option value="draft">Draft</option>
                    <option value="proposed">Proposed</option>
                    <option value="published">Published</option>
                    <option value="rejected">Rejected</option>
                  </Select>
                </div>
                <div>
                  <Text className="text-sm font-medium mb-2">Thumbnail URL</Text>
                  <Input
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isGiftcard"
                  checked={isGiftcard}
                  onChange={(e) => setIsGiftcard(e.target.checked)}
                />
                <label htmlFor="isGiftcard">This is a gift card</label>
              </div>
            </div>
          )}

          {/* Variants Tab */}
          {activeTab === 'variants' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Text className="text-lg font-medium">Product Variants</Text>
                <Button type="button" onClick={addVariant}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Variant
                </Button>
              </div>

              {variants.map((variant, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Text className="font-medium">Variant {index + 1}</Text>
                    {variants.length > 1 && (
                      <Button
                        type="button"
                        variant="transparent"
                        onClick={() => removeVariant(index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Text className="text-sm font-medium mb-2">Title</Text>
                      <Input
                        value={variant.title}
                        onChange={(e) => updateVariant(index, 'title', e.target.value)}
                        placeholder="Variant title"
                      />
                    </div>
                    <div>
                      <Text className="text-sm font-medium mb-2">SKU</Text>
                      <Input
                        value={variant.sku}
                        onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                        placeholder="SKU-001"
                      />
                    </div>
                  </div>

                  <div>
                    <Text className="text-sm font-medium mb-2">Price (USD cents)</Text>
                    <Input
                      type="number"
                      value={variant.prices[0]?.amount || 0}
                      onChange={(e) => {
                        const newPrices = [...variant.prices]
                        newPrices[0] = { ...newPrices[0], amount: parseInt(e.target.value) || 0 }
                        updateVariant(index, 'prices', newPrices)
                      }}
                      placeholder="1000"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Options Tab */}
          {activeTab === 'options' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Text className="text-lg font-medium">Product Options</Text>
                <Button type="button" onClick={addOption}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>

              {options.map((option, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Text className="font-medium">Option {index + 1}</Text>
                    <Button
                      type="button"
                      variant="transparent"
                      onClick={() => removeOption(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div>
                    <Text className="text-sm font-medium mb-2">Title</Text>
                    <Input
                      value={option.title}
                      onChange={(e) => updateOption(index, 'title', e.target.value)}
                      placeholder="Size, Color, etc."
                    />
                  </div>

                  <div>
                    <Text className="text-sm font-medium mb-2">Values (comma-separated)</Text>
                    <Input
                      value={option.values.join(', ')}
                      onChange={(e) => updateOption(index, 'values', e.target.value.split(',').map(v => v.trim()))}
                      placeholder="S, M, L, XL"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Images Tab */}
          {activeTab === 'images' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Text className="text-lg font-medium">Product Images</Text>
                <Button type="button" onClick={addImage}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
              </div>

              {images.map((image, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Text className="font-medium">Image {index + 1}</Text>
                    <Button
                      type="button"
                      variant="transparent"
                      onClick={() => removeImage(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    value={image.url}
                    onChange={(e) => updateImage(index, e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Advanced Tab */}
          {activeTab === 'advanced' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text className="text-sm font-medium mb-2">Weight (g)</Text>
                  <Input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="200"
                  />
                </div>
                <div>
                  <Text className="text-sm font-medium mb-2">Width (cm)</Text>
                  <Input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    placeholder="10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text className="text-sm font-medium mb-2">Length (cm)</Text>
                  <Input
                    type="number"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    placeholder="20"
                  />
                </div>
                <div>
                  <Text className="text-sm font-medium mb-2">Height (cm)</Text>
                  <Input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text className="text-sm font-medium mb-2">Origin Country</Text>
                  <Input
                    value={originCountry}
                    onChange={(e) => setOriginCountry(e.target.value)}
                    placeholder="US"
                  />
                </div>
                <div>
                  <Text className="text-sm font-medium mb-2">Material</Text>
                  <Input
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    placeholder="Cotton"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text className="text-sm font-medium mb-2">HS Code</Text>
                  <Input
                    value={hsCode}
                    onChange={(e) => setHsCode(e.target.value)}
                    placeholder="6104.43.00"
                  />
                </div>
                <div>
                  <Text className="text-sm font-medium mb-2">MID Code</Text>
                  <Input
                    value={midCode}
                    onChange={(e) => setMidCode(e.target.value)}
                    placeholder="MID123"
                  />
                </div>
              </div>

              <div>
                <Text className="text-sm font-medium mb-2">External ID</Text>
                <Input
                  value={externalId}
                  onChange={(e) => setExternalId(e.target.value)}
                  placeholder="ext_123"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="discountable"
                  checked={discountable}
                  onChange={(e) => setDiscountable(e.target.checked)}
                />
                <label htmlFor="discountable">Product can be discounted</label>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 mt-6 pt-6 border-t">
            <Button type="button" variant="transparent" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 
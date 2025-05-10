'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/lib/stores/useAuthStore'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useToast } from '@/hooks/use-toast'

export default function CreateAssetPage() {
  const { isAuthenticated, currentUser } = useAuthStore()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [attributes, setAttributes] = useState([
    { key: 'brand', value: '' },
    { key: 'model', value: '' },
    { key: 'reference', value: '' },
    { key: 'diameter', value: '' },
    { key: 'movement', value: '' },
    { key: 'dialColor', value: '' },
    { key: 'caseMaterial', value: '' },
    { key: 'braceletMaterial', value: '' },
    { key: 'yearOfProduction', value: '' }
  ])
  const [images, setImages] = useState<string[]>([''])
  const [assetDetails, setAssetDetails] = useState('')
  const [expectedNetReturn, setExpectedNetReturn] = useState('')
  const [marketValue, setMarketValue] = useState('')
  const [pastReturns, setPastReturns] = useState('')
  const [earningPotential, setEarningPotential] = useState('')
  const [earningPotentialDuration, setEarningPotentialDuration] = useState('')
  const [currency, setCurrency] = useState('USDC')
  const [description, setDescription] = useState('')
  const [model, setModel] = useState('')
  const [offerViews, setOfferViewViews] = useState(0)
  const [sold, setSold] = useState(0)
  const [total, setTotal] = useState(100)
  const [mintAddress, setMintAddress] = useState('')
  const [about, setAbout] = useState('')
  const [type, setType] = useState('diamond')

  useEffect(() => {
    if (!isAuthenticated && currentUser?.role !== 'admin') {
      router.push('/')
    }
  }, [isAuthenticated, currentUser, router])

  const handleAttributeChange = (index: number, field: 'key' | 'value', newValue: string) => {
    const newAttributes = [...attributes]
    newAttributes[index] = { ...newAttributes[index], [field]: newValue }
    setAttributes(newAttributes)
  }

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images]
    newImages[index] = value
    setImages(newImages)
  }

  const addImageField = () => {
    setImages([...images, ''])
  }

  const removeImageField = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const response = await fetch('/api/admin/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          asset: {
            associatedId: formData.get('associatedId'),
            name: formData.get('name'),
            images: images.filter(img => img.trim() !== ''),
            uri: formData.get('uri'),
            reference: formData.get('reference'),
            assetDetails,
            expectedNetReturn,
            marketValue,
            pastReturns,
            earningPotential,
            earningPotentialDuration,
            currency,
            description,
            model,
            offerViews,
            sold,
            total,
            mintAddress,
            about,
            type,
            attributes: [
              {
                attributeList: attributes.map(attr => ({
                  key: attr.key,
                  value: attr.value
                }))
              }
            ]
          }
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create asset')
      }

      toast({
        title: 'Success',
        description: 'Asset created successfully',
      })

      router.push('/')
    } catch (error) {
      console.error('Error creating asset:', error)
      toast({
        title: 'Error',
        description: 'Failed to create asset. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-2xl py-8 mt-20">
      <h1 className="mb-8 text-2xl font-bold">Create New Asset</h1>
      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="space-y-2">
          <Label htmlFor="associatedId">Associated ID</Label>
          <Input id="associatedId" name="associatedId" type="text" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required />
        </div>

        <div className="space-y-2">
          <Label>Images</Label>
          {images.map((image, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input
                value={image}
                onChange={(e) => handleImageChange(index, e.target.value)}
                placeholder="Image URL"
                required={index === 0}
              />
              {index > 0 && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeImageField(index)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addImageField}>
            Add Another Image
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="assetDetails">Asset Details</Label>
          <Input 
            id="assetDetails" 
            value={assetDetails}
            onChange={(e) => setAssetDetails(e.target.value)}
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expectedNetReturn">Expected Net Return</Label>
          <Input 
            id="expectedNetReturn" 
            value={expectedNetReturn}
            onChange={(e) => setExpectedNetReturn(e.target.value)}
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="marketValue">Market Value</Label>
          <Input 
            id="marketValue" 
            value={marketValue}
            onChange={(e) => setMarketValue(e.target.value)}
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pastReturns">Past Returns</Label>
          <Input 
            id="pastReturns" 
            value={pastReturns}
            onChange={(e) => setPastReturns(e.target.value)}
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="earningPotential">Earning Potential</Label>
          <Input 
            id="earningPotential" 
            value={earningPotential}
            onChange={(e) => setEarningPotential(e.target.value)}
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="earningPotentialDuration">Earning Potential Duration</Label>
          <Input 
            id="earningPotentialDuration" 
            value={earningPotentialDuration}
            onChange={(e) => setEarningPotentialDuration(e.target.value)}
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Input 
            id="currency" 
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input 
            id="description" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input 
            id="model" 
            value={model}
            onChange={(e) => setModel(e.target.value)}
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="offerViews">Offer Views</Label>
          <Input 
            id="offerViews" 
            type="number"
            value={offerViews}
            onChange={(e) => setOfferViewViews(Number(e.target.value))}
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sold">Sold</Label>
          <Input 
            id="sold" 
            type="number"
            value={sold}
            onChange={(e) => setSold(Number(e.target.value))}
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="total">Total</Label>
          <Input 
            id="total" 
            type="number"
            value={total}
            onChange={(e) => setTotal(Number(e.target.value))}
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mintAddress">Mint Address</Label>
          <Input 
            id="mintAddress" 
            value={mintAddress}
            onChange={(e) => setMintAddress(e.target.value)}
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="about">About</Label>
          <Input 
            id="about" 
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Input 
            id="type" 
            value={type}
            onChange={(e) => setType(e.target.value)}
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="uri">URI</Label>
          <Input id="uri" name="uri" type="url" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reference">Reference Number</Label>
          <Input id="reference" name="reference" required />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Asset'}
        </Button>
      </form>
    </div>
  )
} 
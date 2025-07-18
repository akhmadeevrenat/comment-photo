'use client'

import { Trash2, MessageCircle } from 'lucide-react'

interface Photo {
  id: string
  url: string
  name: string
  comments: Comment[]
}

interface Comment {
  id: string
  text: string
  author: string
  timestamp: Date
}

interface PhotoGalleryProps {
  photos: Photo[]
  selectedPhotoId?: string
  onPhotoSelect: (photo: Photo) => void
  onDeletePhoto: (photoId: string) => void
}

export default function PhotoGallery({
  photos,
  selectedPhotoId,
  onPhotoSelect,
  onDeletePhoto
}: PhotoGalleryProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Галерея фотографий</h2>
        <p className="text-sm text-gray-500 mt-1">
          {photos.length} фотографий
        </p>
      </div>
      
      <div className="p-6">
        {photos.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Нет фотографий для отображения</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {photos.map(photo => (
              <div
                key={photo.id}
                className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                  selectedPhotoId === photo.id
                    ? 'border-blue-500 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onPhotoSelect(photo)}
              >
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="w-full h-48 object-cover"
                />
                
                {/* Overlay with info */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all">
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-sm font-medium truncate">{photo.name}</p>
                    <div className="flex items-center mt-1">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      <span className="text-xs">
                        {photo.comments.length} комментариев
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeletePhoto(photo.id)
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                {/* Selection indicator */}
                {selectedPhotoId === photo.id && (
                  <div className="absolute top-2 left-2 p-1 bg-blue-500 text-white rounded-full">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
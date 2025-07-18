'use client'

import { useState } from 'react'
import { Upload, Image, MessageCircle, X } from 'lucide-react'
import PhotoGallery from '@/components/PhotoGallery'
import PhotoUpload from '@/components/PhotoUpload'

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

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [showUpload, setShowUpload] = useState(false)

  const addPhoto = (file: File) => {
    const newPhoto: Photo = {
      id: Date.now().toString(),
      url: URL.createObjectURL(file),
      name: file.name,
      comments: []
    }
    setPhotos(prev => [newPhoto, ...prev])
    setShowUpload(false)
  }

  const addComment = (photoId: string, comment: Omit<Comment, 'id' | 'timestamp'>) => {
    const newComment: Comment = {
      ...comment,
      id: Date.now().toString(),
      timestamp: new Date()
    }
    
    setPhotos(prev => prev.map(photo => 
      photo.id === photoId 
        ? { ...photo, comments: [...photo.comments, newComment] }
        : photo
    ))
  }

  const deletePhoto = (photoId: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId))
    if (selectedPhoto?.id === photoId) {
      setSelectedPhoto(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Image className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">Comment Photo</h1>
            </div>
            <button
              onClick={() => setShowUpload(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Upload className="h-4 w-4 mr-2" />
              Загрузить фото
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {photos.length === 0 ? (
          <div className="text-center py-12">
            <Image className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Нет фотографий</h3>
            <p className="mt-1 text-sm text-gray-500">
              Начните с загрузки первой фотографии
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowUpload(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Upload className="h-4 w-4 mr-2" />
                Загрузить фото
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Photo Gallery */}
            <div className="lg:col-span-2">
              <PhotoGallery
                photos={photos}
                onPhotoSelect={setSelectedPhoto}
                onDeletePhoto={deletePhoto}
                selectedPhotoId={selectedPhoto?.id}
              />
            </div>

            {/* Comments Panel */}
            <div className="lg:col-span-1">
              {selectedPhoto ? (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      <MessageCircle className="inline h-5 w-5 mr-2" />
                      Комментарии
                    </h3>
                    <button
                      onClick={() => setSelectedPhoto(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {selectedPhoto.comments.map(comment => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-medium text-gray-900">
                            {comment.author}
                          </span>
                          <span className="text-xs text-gray-500">
                            {comment.timestamp.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
                      </div>
                    ))}
                  </div>

                  <CommentForm
                    onSubmit={(comment) => addComment(selectedPhoto.id, comment)}
                  />
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <MessageCircle className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Выберите фотографию для просмотра комментариев
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Upload Modal */}
      {showUpload && (
        <PhotoUpload
          onUpload={addPhoto}
          onClose={() => setShowUpload(false)}
        />
      )}
    </div>
  )
}

function CommentForm({ onSubmit }: { onSubmit: (comment: Omit<Comment, 'id' | 'timestamp'>) => void }) {
  const [text, setText] = useState('')
  const [author, setAuthor] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim() && author.trim()) {
      onSubmit({ text: text.trim(), author: author.trim() })
      setText('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <input
        type="text"
        placeholder="Ваше имя"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <textarea
        placeholder="Ваш комментарий..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Добавить комментарий
      </button>
    </form>
  )
}
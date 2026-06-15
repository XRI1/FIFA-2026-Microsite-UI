import { useState } from 'react';
import { Camera, Upload, Download, Share2, Heart } from 'lucide-react';

interface PhotoEntry {
  id: string;
  userId: string;
  userName: string;
  team: string;
  teamFlag: string;
  imageUrl: string;
  caption: string;
  likes: number;
  timestamp: string;
}

export function PhotoboothView() {
  const [mode, setMode] = useState<'create' | 'gallery'>('gallery');
  const [selectedFrame, setSelectedFrame] = useState<string>('fifa-2026');
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [caption, setCaption] = useState('');

  const frames = [
    { id: 'fifa-2026', name: 'FIFA 2026', preview: '⚽' },
    { id: 'lg-football', name: 'LG Football', preview: '📺' },
    { id: 'superfan', name: 'Superfan', preview: '🏆' },
    { id: 'team-pride', name: 'Team Pride', preview: '🎉' },
  ];

  const galleryPhotos: PhotoEntry[] = [
    {
      id: '1',
      userId: '123',
      userName: 'Rahul Ahmed',
      team: 'Argentina',
      teamFlag: '🇦🇷',
      imageUrl: '',
      caption: 'Ready for the match! 🔥',
      likes: 45,
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      userId: '124',
      userName: 'Priya Das',
      team: 'Brazil',
      teamFlag: '🇧🇷',
      caption: 'Life is Good with LG! ⚽',
      imageUrl: '',
      likes: 38,
      timestamp: '3 hours ago',
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    console.log('Submitting photo with frame:', selectedFrame, 'caption:', caption);
    setMode('gallery');
    setPhotoPreview('');
    setCaption('');
  };

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="bg-[#F0ECE4] rounded-xl p-2 flex gap-2 shadow-sm">
        <button
          onClick={() => setMode('create')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all ${
            mode === 'create'
              ? 'bg-lg-red text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Camera className="w-5 h-5" />
          Create
        </button>
        <button
          onClick={() => setMode('gallery')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all ${
            mode === 'gallery'
              ? 'bg-lg-red text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Share2 className="w-5 h-5" />
          Gallery
        </button>
      </div>

      {/* Create Mode */}
      {mode === 'create' && (
        <div className="bg-[#F0ECE4] rounded-xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-4">Choose a Frame</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {frames.map((frame) => (
                <button
                  key={frame.id}
                  onClick={() => setSelectedFrame(frame.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedFrame === frame.id
                      ? 'border-lg-deep-purple bg-lg-deep-purple/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-4xl mb-2">{frame.preview}</div>
                  <div className="text-sm font-semibold">{frame.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Upload Photo</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-lg-red transition-colors">
              {photoPreview ? (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="max-h-80 mx-auto rounded-lg mb-4"
                  />
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-lg-red text-white px-4 py-2 rounded-full text-sm font-semibold">
                    {frames.find(f => f.id === selectedFrame)?.name} Frame
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Upload or take a photo</p>
                </>
              )}
              <label className="cursor-pointer">
                <span className="text-lg-red font-semibold hover:underline">
                  {photoPreview ? 'Change Photo' : 'Choose Photo'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {photoPreview && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Add a caption</label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-lg-red focus:ring-2 focus:ring-lg-red/20 outline-none"
                  placeholder="Share your moment..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-lg-red hover:bg-lg-red/90 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  Share to Gallery
                </button>
                <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all">
                  <Download className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Gallery Mode */}
      {mode === 'gallery' && (
        <div className="space-y-4">
          {galleryPhotos.map((photo) => (
            <div key={photo.id} className="bg-[#F0ECE4] rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 flex items-center gap-3 border-b">
                <div className="w-10 h-10 bg-gradient-to-br from-lg-red to-lg-purple rounded-full flex items-center justify-center text-white font-bold">
                  {photo.userName[0]}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{photo.userName}</h4>
                  <p className="text-xs text-gray-500">
                    {photo.teamFlag} Team {photo.team} • {photo.timestamp}
                  </p>
                </div>
              </div>

              <div className="bg-gray-100 aspect-square flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-2">📸</div>
                  <p className="text-gray-500">Photo with frame overlay</p>
                </div>
              </div>

              <div className="p-4">
                <p className="mb-3">{photo.caption}</p>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-lg-red hover:text-lg-red/80 transition-colors">
                    <Heart className="w-5 h-5" />
                    <span className="font-semibold">{photo.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm">Share</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {galleryPhotos.length === 0 && (
            <div className="bg-[#F0ECE4] rounded-xl p-12 text-center">
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No photos yet</h3>
              <p className="text-gray-600 mb-4">Be the first to share a photo!</p>
              <button
                onClick={() => setMode('create')}
                className="bg-lg-red hover:bg-lg-red/90 text-white font-semibold py-2 px-6 rounded-lg transition-all"
              >
                Create Photo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import { FiX } from 'react-icons/fi'

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><FiX /></button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}
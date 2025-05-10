export const Modal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}) => {
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 opacity-0 transition-opacity duration-700 ${
        !isOpen ? 'pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-xl p-6 max-w-md w-full relative shadow-lg min-h-[200px] flex h-full max-h-[400px] opacity-0 transition-opacity duration-700 ${
          !isOpen ? 'pointer-events-none' : 'opacity-100 pointer-events-auto'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  )
}

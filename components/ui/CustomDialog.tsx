import { useEffect } from "react";

export default function CustomDialog({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-background max-h-[90vh] w-[95vw] max-w-xl overflow-y-auto rounded-lg shadow-lg p-4 relative">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        {/* 标题 */}
        <h2 className="text-lg font-semibold mb-4">{title}</h2>

        {/* 内容 */}
        <div className="space-y-2">{children}</div>
      </div>
    </div>
  );
}

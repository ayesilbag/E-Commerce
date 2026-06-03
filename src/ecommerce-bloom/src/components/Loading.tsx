import { Loader2 } from "lucide-react";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullScreen?: boolean;
}

const Loading = ({ size = "md", text, fullScreen = false }: LoadingProps) => {
  const sizeClasses = {
    sm: "h-3 xs:h-3.5 md:h-4 w-3 xs:w-3.5 md:w-4",
    md: "h-6 xs:h-7 md:h-8 w-6 xs:w-7 md:w-8",
    lg: "h-10 xs:h-11 md:h-12 w-10 xs:w-11 md:w-12"
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-2 xs:gap-2.5 md:gap-3">
      <Loader2 className={`animate-spin text-purple-default ${sizeClasses[size]}`} />
      {text && <p className="text-xs text-gray-600 text-center">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;
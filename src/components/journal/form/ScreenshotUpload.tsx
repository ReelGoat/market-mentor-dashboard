
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X } from 'lucide-react';

interface ScreenshotUploadProps {
  screenshot?: string;
  onScreenshotChange: (value: string | undefined) => void;
}

const ScreenshotUpload: React.FC<ScreenshotUploadProps> = ({ 
  screenshot, 
  onScreenshotChange 
}) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onScreenshotChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="screenshot">Trade Screenshot</Label>
      <Input
        id="screenshot"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="bg-secondary/60 text-foreground"
      />
      {screenshot && (
        <div className="mt-2 relative rounded-md overflow-hidden w-full h-32">
          <img
            src={screenshot}
            alt="Trade screenshot"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() => onScreenshotChange(undefined)}
            className="absolute top-2 right-2 bg-cardDark p-1 rounded-full"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ScreenshotUpload;

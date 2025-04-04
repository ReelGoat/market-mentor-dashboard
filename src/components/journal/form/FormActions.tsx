
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save } from 'lucide-react';

interface FormActionsProps {
  onCancel: () => void;
  isEditing: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ onCancel, isEditing }) => {
  return (
    <div className="flex justify-end space-x-2 pt-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" className="bg-profit text-black hover:bg-profit/90">
        <Save className="mr-2 h-4 w-4" />
        {isEditing ? 'Update Trade' : 'Save Trade'}
      </Button>
    </div>
  );
};

export default FormActions;

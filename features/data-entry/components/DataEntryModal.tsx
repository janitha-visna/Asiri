import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { DataEntryField } from "../data-entry.types";
import { MODAL_CONTENT_REGISTRY } from "./modals/modalRegistry";

type DataEntryModalProps = {
  field: DataEntryField | null;
  value?: string;
  onClose: () => void;
  onSave: (fieldKey: DataEntryField["key"], value: string) => void;
};

export function DataEntryModal({
  field,
  value,
  onClose,
  onSave,
}: DataEntryModalProps) {
  if (!field) return null;

  const ModalContent = MODAL_CONTENT_REGISTRY[field.key];

  return (
    <Dialog open={!!field} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{field.label}</DialogTitle>
        </DialogHeader>
        <ModalContent
          value={value}
          onClose={onClose}
          onSave={(newValue) => onSave(field.key, newValue)}
        />
      </DialogContent>
    </Dialog>
  );
}

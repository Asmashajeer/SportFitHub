import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface props {
  icon: React.ReactNode;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

const ConfirmDialog = ({
  icon,
  title,
  description,
  onConfirm,
  onCancel,
}: props) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="p-1 rounded-full cursor-pointer">
          {icon}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onCancel?.()}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm()}
            className="bg-red-600 hover:bg-red-700"
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDialog;

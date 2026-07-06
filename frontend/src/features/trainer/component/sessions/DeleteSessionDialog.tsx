import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
 
} from '@/components/ui/alert-dialog';
import { AlertCircle, } from 'lucide-react';




const DeleteSessionDialog = ({sessionId,onCancel,sessionVisibility, onDeleteAnyway}:
{  sessionId:string,
  onCancel: () => void;
  sessionVisibility: (sessionId:string,isActive:boolean) => void;
  onDeleteAnyway: () => void;
}) => {
  return (
    <AlertDialog open={true} onOpenChange={onCancel}>
      <AlertDialogContent className='border shadow-gray-600'>
        <AlertDialogHeader>
          <AlertDialogTitle className='flex items-center gap-2'><AlertCircle className='text-amber-400'/> This session has active bookings</AlertDialogTitle>
          <AlertDialogDescription>
            <p className='text-bold'>Choose how you want to proceed</p>
            <ul>
              <li>1. Make Inactive- Stop further booking</li>           
              <li>2. DeleteAnyway- 
                  <li>-Cancel all bookings,Refund to users to their wallet ,</li>
                 <li>-Notify all affected users</li> 
                  <li>-Apply a penalty and strike points to your account</li>  
              </li>
              <p className='text-xs text-red-400 py-2'>Note: <ul>
                <li> Session deletion is only allowed if bookings are before the cancellation deadline</li>
                <li>Repeated cancellation leads to review and  suspension of your account </li></ul></p>
            </ul>
            
            
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            Cancel Deletion
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={()=>sessionVisibility(sessionId,false)}
            className="bg-amber-500 hover:bg-amber-600 text-black"
          >
            Make Inactive
          </AlertDialogAction>
          <AlertDialogAction
            onClick={onDeleteAnyway}
            className="bg-red-600 hover:bg-red-700"
          >
           Yes, Delete Anyway
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteSessionDialog;
